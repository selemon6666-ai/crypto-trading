// supabase.js
// Supabase configuration
const SUPABASE_URL = 'https://zvfnqldeazdjokuqfegg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm5xbGRlYXpkam9rdXFmZWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDI0OTMsImV4cCI6MjA5MjcxODQ5M30.MyYRk6SPO9PfFkWlNUYdZMVbcEqUOizNMiriMuZGJ8o';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Sign Up
async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: fullName } }
    });
    
    if (error) throw error;
    
    // Create user profile in users table
    if (data.user) {
        await supabase.from('users').insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            balance: 0,
            kyc_status: 'pending'
        });
    }
    
    return data;
}

// Sign In
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) throw error;
    return data;
}

// Sign Out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// Get Current User
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

// Get User Profile
async function getUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (error) throw error;
    return data;
}

// Update User Balance
async function updateBalance(userId, newBalance) {
    const { data, error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);
    
    if (error) throw error;
    return data;
}

// ============================================
// TRADE FUNCTIONS
// ============================================

// Create Trade
async function createTrade(tradeData) {
    const { data, error } = await supabase
        .from('trades')
        .insert(tradeData);
    
    if (error) throw error;
    return data;
}

// Get User Trades
async function getUserTrades() {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Get All Trades (Admin Only)
async function getAllTrades() {
    const { data, error } = await supabase
        .from('trades')
        .select('*, users(email, full_name)')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Set Trade Outcome (Admin Only)
async function setTradeOutcome(tradeId, outcome) {
    const { data: trade } = await supabase
        .from('trades')
        .select('*')
        .eq('id', tradeId)
        .single();
    
    if (outcome === 'win') {
        const profit = trade.expected_profit;
        const totalReturn = trade.amount + profit;
        
        await supabase
            .from('trades')
            .update({ status: 'won', profit: profit, completed_at: new Date() })
            .eq('id', tradeId);
        
        const { data: user } = await supabase
            .from('users')
            .select('balance')
            .eq('id', trade.user_id)
            .single();
        
        await supabase
            .from('users')
            .update({ balance: (user.balance || 0) + totalReturn })
            .eq('id', trade.user_id);
    } else {
        await supabase
            .from('trades')
            .update({ status: 'lost', profit: -trade.amount, completed_at: new Date() })
            .eq('id', tradeId);
    }
}

// ============================================
// DEPOSIT FUNCTIONS
// ============================================

// Create Deposit Request
async function createDeposit(depositData) {
    const { data, error } = await supabase
        .from('deposits')
        .insert(depositData);
    
    if (error) throw error;
    return data;
}

// Get Deposit Addresses
async function getDepositAddresses() {
    const { data, error } = await supabase
        .from('deposit_addresses')
        .select('*');
    
    if (error) throw error;
    return data;
}

// Get Pending Deposits (Admin Only)
async function getPendingDeposits() {
    const { data, error } = await supabase
        .from('deposits')
        .select('*, users(email, full_name)')
        .eq('status', 'pending');
    
    if (error) throw error;
    return data;
}

// Approve Deposit (Admin Only)
async function approveDeposit(depositId, userId, amount) {
    await supabase
        .from('deposits')
        .update({ status: 'approved', approved_at: new Date() })
        .eq('id', depositId);
    
    const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();
    
    await supabase
        .from('users')
        .update({ balance: (user.balance || 0) + amount })
        .eq('id', userId);
}

// ============================================
// WITHDRAWAL FUNCTIONS
// ============================================

// Create Withdrawal Request
async function createWithdrawal(withdrawalData) {
    const { data, error } = await supabase
        .from('withdrawals')
        .insert(withdrawalData);
    
    if (error) throw error;
    return data;
}

// Get Pending Withdrawals (Admin Only)
async function getPendingWithdrawals() {
    const { data, error } = await supabase
        .from('withdrawals')
        .select('*, users(email, full_name, balance)')
        .eq('status', 'pending');
    
    if (error) throw error;
    return data;
}

// Approve Withdrawal (Admin Only)
async function approveWithdrawal(withdrawalId, userId, amount) {
    await supabase
        .from('withdrawals')
        .update({ status: 'approved', approved_at: new Date() })
        .eq('id', withdrawalId);
    
    const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();
    
    await supabase
        .from('users')
        .update({ balance: (user.balance || 0) - amount })
        .eq('id', userId);
}

// ============================================
// KYC FUNCTIONS
// ============================================

// Create KYC Request
async function createKYCRequest(kycData) {
    const { data, error } = await supabase
        .from('kyc_requests')
        .insert(kycData);
    
    if (error) throw error;
    return data;
}

// Get Pending KYC (Admin Only)
async function getPendingKYC() {
    const { data, error } = await supabase
        .from('kyc_requests')
        .select('*, users(email, full_name)')
        .eq('status', 'pending');
    
    if (error) throw error;
    return data;
}

// Approve KYC (Admin Only)
async function approveKYC(requestId, userId) {
    await supabase
        .from('kyc_requests')
        .update({ status: 'approved', reviewed_at: new Date() })
        .eq('id', requestId);
    
    await supabase
        .from('users')
        .update({ kyc_status: 'verified' })
        .eq('id', userId);
}

// ============================================
// DEPOSIT ADDRESS MANAGEMENT (Admin)
// ============================================

// Update Deposit Address
async function updateDepositAddress(currency, address) {
    const { data, error } = await supabase
        .from('deposit_addresses')
        .update({ address: address, updated_at: new Date() })
        .eq('currency', currency);
    
    if (error) throw error;
    return data;
}

// ============================================
// GET ALL USERS (Admin Only)
// ============================================

async function getAllUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Export for use in HTML
window.supabaseClient = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getUserProfile,
    updateBalance,
    createTrade,
    getUserTrades,
    getAllTrades,
    setTradeOutcome,
    createDeposit,
    getDepositAddresses,
    getPendingDeposits,
    approveDeposit,
    createWithdrawal,
    getPendingWithdrawals,
    approveWithdrawal,
    createKYCRequest,
    getPendingKYC,
    approveKYC,
    updateDepositAddress,
    getAllUsers
};
