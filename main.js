// ===== STATE =====
let S={
  onboarded:false,
  checkinAnchorDate:null, moneyDialTags:[], customDialTags:[], investPendingConfirm:false,
  lang:null, hasSetLanguage:false,
  invoiceLogo:null,
  tipsSeen:{},
  settings:{baseline:0,taxRate:.32,hstRate:.13,duesRate:.03,enjoyPct:.20},
  balances:{checking:0,savings:0,tfsa:0,invest:0},
  debt:{cc:0,loan:0},
  selfLoan:0,
  currency:'$',
  expenses:[
    {id:1,name:'Rent / Mortgage',amt:0},
    {id:2,name:'Groceries',amt:0},
    {id:3,name:'Utilities',amt:0},
    {id:4,name:'Transit / Car',amt:0},
    {id:5,name:'Childcare',amt:0},
    {id:6,name:'Other fixed costs',amt:0}
  ],
  buckets:[],invAccounts:[],gigs:[],
  funFund:{current:0,next:0,lastResetMonth:-1},
  learnMode:true,toggleCarry:false,toggleBuffer:false,
  analytics:{
    onboardingDropStep:null,
    sessionsCount:0,
    gigsLogged:0,
    screenVisits:{},
    learnModeChanges:0
  }
};

// ===== I18N =====
const I18N = {
en:{
  lang_title:"Choose your language", lang_sub:"You can change this anytime in Settings.",
  lang_en:"English", lang_es:"Español", lang_fr:"Français", lang_confirm:"Continue",
  nav_dashboard:"Dashboard", nav_gigs:"Gigs", nav_reports:"Reports",
  onb1_title:"Your monthly baseline", onb1_sub:"Add every fixed cost — rent, groceries, utilities, childcare. This is the number your income is measured against each month.",
  onb1_add_expense:"Add expense", onb1_baseline_label:"Monthly baseline", onb1_continue:"Continue", onb1_suggestion_note:"The grey numbers are rough starting suggestions — type your real amount to replace them.", terms_title:"Terms & disclaimer", terms_p1:"artisticAutonomy™ is a proprietary tool created by Alejandro Céspedes. The name, branding, design, and underlying code are protected by copyright and trademark. This beta version is shared privately for testing purposes only and is not licensed for redistribution, copying, or commercial reuse.", terms_p2_strong:"Not financial advice.", terms_p2:"This app is an organizational and educational tool. It does not provide financial, tax, legal, or investment advice. Calculations are based on the percentages and settings you enter.", terms_professional_strong:"When to talk to a real professional.", terms_professional_intro:"This app helps you organize and understand your numbers — it is not a substitute for personalized advice. Talk to a qualified accountant, tax professional, or financial advisor when:", terms_prof_1:"You are registering for sales tax (HST/GST/VAT) for the first time, or unsure if you should be", terms_prof_2:"You receive a tax bill that surprises you, or are behind on tax payments", terms_prof_3:"You are dealing with debt beyond what a simple payment plan can address", terms_prof_4:"You receive a large one-time payment or windfall", terms_prof_5:"You are a few years from retirement, or planning a major life change", terms_prof_6:"Your situation involves multiple income types, provinces/states, or countries", terms_p3_strong:"Your data.", terms_p3:"All information you enter stays on your own device, stored locally in your browser. It is never transmitted to or stored on any external server by this app. You are responsible for backing up your data using the export feature, as clearing your browser data will erase it.", terms_p4_strong:"Beta software.", terms_p4:"This app is under active development. Features, calculations, and data structures may change. While care is taken to keep your data intact across updates, no guarantee is made against data loss — please export backups regularly.", terms_got_it:"Got it",
  onb2_title:"Tax settings", onb2_sub:"These drive every calculation. Defaults are set for Ontario — adjust for your province or country.",
  onb2_currency_label:"Currency symbol", onb2_currency_other_label:"Your currency symbol",
  onb2_tax_label:"Tax set-aside % (includes pension contribution)", onb2_hst_label:"Sales tax %", onb2_dues_label:"Work dues %",
  onb2_note:"Your tax set-aside covers income tax and pension contributions. If unsure, 32-35% is a safe starting point for most freelancers — adjust as needed.",
  onb2_continue:"Continue", onb2_back:"Back",
  onb3_title:"Your savings goals", onb3_sub:"Name your savings buckets and assign a percentage of each gig's surplus. Vacation fund, emergency fund, new instrument — whatever matters to you.",
  onb3_note:"This is your surplus. Every dollar gets a destination — enjoy next month, save, or invest.",
  onb3_bucket_name_placeholder:"e.g. Vacation fund", onb3_pct_left_prefix:"Remaining for investing:",
  onb3_continue:"Continue", onb3_back:"Back",
  onb4_title:"Investing", onb4_sub:"Whatever's left after tax, dues, your savings goals, and enjoy-life automatically goes to Invest — no splitting or naming required. Open a self-directed investment account (RRSP, TFSA, brokerage, or your local equivalent) and make sure that surplus actually gets invested once it lands there.",
  onb4_enjoy_label:"Enjoy-life % (of remaining surplus)", onb4_start:"Start tracking", onb4_back:"Back",
  dash_this_month:"This month", dash_status_label:"Status", settings_language:"Language", settings_change_language:"Change language", tip_gated_status:"This shows whether this month's baseline is covered yet — surplus only splits once it is.", tip_setaside:"This is the running total that should be sitting in your real-world set-aside account, not just tracked here.", tip_momentum:"Tap a bar to see exactly where that month's surplus went.", tip_historical:"Use this for gigs that already happened — enter what actually occurred instead of letting the app calculate it.", settings_tips_section:"Tips", settings_replay_tips:"Replay tips", settings_guided_tour:"Take the guided tour", gloss_page_title:"Glossary", gloss_h_setaside:"Set-aside account", gloss_p_setaside:"A high-interest savings account where your tax set-aside, savings buckets, and enjoy-life allocation park after each gig, earning interest while they wait. In Canada this is a HISA (High-Interest Savings Account); in the US, a HYSA (High-Yield Savings Account). If you are elsewhere, look for the equivalent at your bank: a high-yield savings account, notice account, or similar. The concept is the same everywhere: money earns interest while it waits, rather than sitting idle.", gloss_h_baseline:"Baseline", gloss_p_baseline:"Your total fixed monthly costs — rent, utilities, groceries, insurance, everything that goes out every month regardless of whether you worked. This is the number your income is measured against. Once covered, the surplus unlocks.", gloss_h_gated:"Gated surplus", gloss_p_gated:"The amount available to allocate toward savings and investing — but only after the baseline is fully covered for the month. The gate protects your fixed costs before anything else moves.", gloss_h_salestax:"Sales tax", gloss_p_salestax:"Tax collected from clients on behalf of the government, added on top of your fee. In Canada this is HST or GST. In Europe it is VAT. In Latin America, IVA. In Australia, GST. The concept and the app's handling of it are identical regardless of what your country calls it. Only applies if you are registered to collect it — check your local threshold.", gloss_h_workdues:"Work dues", gloss_p_workdues:"Fees paid to a professional association or union calculated as a percentage of your scale fee. In Canada this commonly applies to AFM (musicians' union) members. Outside Canada your equivalent might be the Musicians' Union (UK), ISMA, or another body. If you do not belong to a union or association, turn this off — it will not affect your calculations.", gloss_h_enjoy:"Enjoy-life allocation", gloss_p_enjoy:"A deliberate percentage of your surplus set aside for guilt-free spending. It parks in your set-aside account while it waits, then moves back to savings on the 1st of each month — ready to top up chequing as you actually spend it. Intentional enjoyment is part of a sustainable financial plan.", gloss_h_saved:"Saved & invested", gloss_p_saved:"The percentage of your net income over the last 90 days that went toward savings buckets or investing. Higher means more of your earnings are working for your future rather than passing through.", gloss_h_funfund:"Fun fund", gloss_p_funfund:"Last month's enjoy-life allocations, released on the 1st of this month as your spending ceiling. The app does not track what you spend it on — that is intentional. Any unspent amount either carries forward or resets, depending on your setting.", gloss_h_selfloan:"Self-loan", gloss_p_selfloan:"Money you borrowed from your own surplus — not from a creditor, but from your future savings or investing. Tracked separately because the obligation is to yourself, not a lender. Log it when you redirect surplus for an immediate need, and pay it back through future gigs when the situation allows.", gloss_h_taxsetaside:"Tax set-aside", gloss_p_taxsetaside:"The percentage you hold back from every gig to cover your income tax bill and pension contributions at year end. Your accountant can confirm the right number for your situation. If unsure: 32% is a reasonable starting point for most Canadian freelancers; 35% is safer if you want to avoid a surprise; outside Canada, research your self-employment tax rate — it is almost always higher than employees pay.", btn_back:"Back", hiw_page_title:"How it works", hiw_h_core:"The core idea", hiw_p_core:"Every gig you earn goes through a simple sequence: government obligations first, then your baseline costs, then — only after those are covered — the rest is yours to allocate intentionally.", hiw_h1:"1. Tax + dues → set-aside account immediately", hiw_p1:"The moment a gig is logged, the government's portion is calculated and flagged for your high-interest savings account. It earns interest there until due — and stays separate so you are never tempted to spend it.", hiw_h2:"2. Baseline covered first", hiw_p2:"Your net income accumulates month by month. Only after it clears your baseline does the surplus unlock. This ensures your fixed costs are never at risk. To cover your baseline faster, consider growing your income — more gigs, higher-paying engagements, or a complementary income stream alongside your creative work. Many working musicians fund their art through parallel work that does not compromise it — it gives them the financial runway to do more of what they love.", hiw_h3:"3. Surplus splits intentionally", hiw_p3:"The surplus divides between enjoy-life, your savings buckets, and investing. You set the percentages and can change them anytime in Settings. Important: even when you have debt payments, the app always preserves a portion for enjoy-life and investing. This is intentional — the discipline of moving something forward on every payment, however small, is the habit that builds financial health over time. Debt is addressed through surplus, never by eliminating saving and investing entirely.", hiw_h_accounts:"The accounts that make this work", hiw_p_accounts_intro:"You do not need to open everything at once — but having three separate accounts makes this system much cleaner in practice.", hiw_h_chequing:"Chequing — your transaction account", hiw_p_chequing:"Day-to-day spending flows through here. Keep only what you need for the current week. Everything else earns more interest elsewhere.", hiw_h_savings:"Savings and your set-aside account — your two holding accounts", hiw_p_savings:"These serve different purposes. Your savings account is where your baseline sits between gigs — it feeds chequing as bills come in. Your set-aside account (a high-interest savings account, or the equivalent at your bank) is where your tax set-aside, savings bucket allocations, and enjoy-life allocation park after each gig — earning interest while they wait. On the 1st of each month, your enjoy-life allocation moves from the set-aside account back to savings, where it tops up chequing as you spend during the month. A high-interest set-aside account earns significantly more than a regular savings account — worth switching if you have not already.", hiw_h_invest:"Investment account — your future account", hiw_p_invest:"Where the invest portion goes and stays. Important: opening the account is step one, but the money needs to actually be invested once it lands there — placed into an index fund, ETF, or other vehicle. An account sitting in cash is not investing. This is a two-step process that many people miss. What you invest in is your decision — do your own research and speak with a professional about what is right for your specific situation. This app does not give investment advice.", hiw_h_percentages:"Setting your percentages", hiw_p_percentages_intro:"Not sure what percentages to enter for your savings buckets? Here is a practical starting framework.", hiw_h_math:"The math is simple", hiw_p_math:"Annual goal ÷ annual freelance income = percentage per gig. If you earn roughly $30,000 as a freelancer and want to set aside $6,000 for a vacation, that is $6,000 ÷ $30,000 = 20%. Set your vacation bucket to 20% and each gig automatically moves 20% of its surplus toward that goal.", hiw_h_example:"Example — Canadian freelancer", hiw_p_example:"Annual income: $30,000. Vacation goal: $6,000 → 20%. TFSA contribution goal: $7,000 → 24%. Tax set-aside: 35% (covers income tax + pension contributions). After tax, vacation, and TFSA prep, roughly 50-55% of each surplus goes to investing or debt paydown — a healthy building-future percentage. Adjust to match your actual goals and local tax obligations. Your accountant can confirm the right tax rate for your situation.", hiw_h_gated_reminder:"The gated surplus reminder", hiw_p_gated_reminder:"These percentages apply only to your surplus — what is left after your monthly baseline is covered. If a gig does not clear the baseline gate, nothing splits yet. The full gig goes toward covering baseline first, and the splits open on the next gig that pushes you over.", hiw_h_enjoy_flow:"Your enjoy-life money flow", hiw_h_where:"Where it goes and when", hiw_p_where:"Each gig's enjoy-life allocation parks in your set-aside account alongside the tax money — it earns interest while it waits. On the 1st of each month, move that amount back to your savings account. Then top up chequing from savings as you actually spend it during the month. The app shows your available spending money in the \"Spending money this month\" banner on the dashboard.", gig_hist_toggle_label:"Historical entry", default_setaside_name:"your set-aside account", default_invest_name:"your investment account", default_chequing_name:"your chequing account", gig_edit_title:"Edit gig", btn_save_changes:"Save changes", hm_tax_dues_note:"Tax + dues: {amt} — stays in set-aside account until needed", hm_gov_label:"Tax set-aside", hm_gov_sub:"stays in set-aside account until tax time", hm_savings_label:"Savings goals", hm_savings_sub:"stays until you need it", hm_enjoy_label:"Enjoy-life allocation", hm_enjoy_sub:"move back to savings on the 1st", gig_title:"Log a gig", gig_date:"Date", gig_date_err:"Please add a date", gig_status:"Status", gig_status_received:"Received", gig_status_pending:"Pending", hist_note:"Enter what actually happened instead of auto-calculating", hist_what_happened:"What actually happened", hist_scale_fee:"Scale fee ($)", hist_cartage:"Cartage / tips ($)", hist_tax:"Tax set-aside ($)", hist_hst:"Sales tax ($)", hist_dues:"Work dues ($)", hist_net:"Net liquid ($)", hist_enjoy:"Enjoy next month ($)", hist_invest:"Invested ($)", hist_cc:"Credit card paid ($)", hist_loan:"Other debt paid ($)", hist_sl_borrow:"Self-loan borrowed ($)", hist_sl_repay:"Self-loan repaid ($)", hist_income_type:"Income type", hist_type_freelance:"Self-employed / Freelance", hist_type_employment:"Employment (T4 — tax at source)", hist_type_other:"Other", hist_notes:"Notes", hist_notes_ph:"e.g. T4, HST not collected, cash payment...", hist_transfer_header:"Set-aside account transfer (tax + dues)", gig_desc:"Description", gig_desc_ph:"e.g. Concert, rehearsal, performance, event", gig_desc_err:"Please add a description", gig_payer:"Payer", gig_payer_ph:"Organization or person", gig_payer_err:"Please add the payer", gig_income_type:"Income type", gig_type_freelance:"Self-employed / freelance", gig_type_employment:"Employment (tax deducted at source)", gig_type_other:"Other", check_helper_title:"Check amount helper (optional)", check_amount_label:"Amount on check", check_calc_label:"Calculated scale fee", check_helper_note:"Enter the payment received and the scale fee will be estimated. Confirm it matches your invoice, then it auto-fills below.", gig_scale_fee:"Scale fee", gig_scale_fee_err:"Please add a scale fee", gig_cartage:"Cartage / tips ($)", apply_sales_tax:"Apply sales tax to this gig", apply_work_dues:"Apply work dues to this gig", debt_payments_title:"Debt payments from this gig (optional)", debt_cc_label:"Credit card ($)", debt_loan_label:"Other debt ($)", debt_note:"Comes out of this gig's surplus, the same money that would otherwise go to enjoy-life, savings, or investing.", selfloan_title:"Self-loan (optional)", selfloan_borrow_label:"Borrow from this gig ($)", selfloan_repay_label:"Pay yourself back ($)", selfloan_tip:"Money you owe yourself, separate from debt to a creditor. Borrowing comes out of this gig's surplus — money already earmarked for savings or investing. \"Pay yourself back\" reduces what you owe yourself, the same way debt payments reduce what you owe a creditor.", gig_notes:"Notes (optional)", gig_notes_ph:"Any notes about this gig", split_where:"Where this goes", gig_hisa_tip:"Tax set-aside + pension contributions. Park this in your high-interest savings account — it earns interest until it's due and stays separate so it's not tempting to spend.", btn_add_gig:"Add gig", btn_cancel:"Cancel", gig_logged_title:"Gig logged", hm_tip:"It all earns interest while it waits. Here is what it is holding:", hm_sub_logged:"“{name}” is logged.", hm_sub_historical:"“{name}” logged as historical entry.", hm_move_now:"Move to {account} now", hm_transfer:"Transfer to {account}", split_income_tax:"Income tax set-aside", split_sales_tax:"Sales tax collected", split_work_dues:"Work dues", split_net_liquid:"Net liquid", split_baseline_covered:"Baseline already covered this month", split_toward_baseline:"This gig goes toward your baseline ({amt} still needed)", split_surplus:"Surplus from this gig: {amt}", split_selfloan_capped:"Borrow capped at available surplus ({amt}) — can't borrow more than this gig generated", split_selfloan_repay_capped:"Repayment capped at remaining surplus — not enough left in this gig to pay back that much", split_cc_capped:"Credit card payment capped — not enough surplus left in this gig", split_loan_capped:"Other debt payment capped — not enough surplus left in this gig", split_selfloan_borrowed:"Self-loan borrowed", split_paying_back:"Paying yourself back", split_cc_payment:"Credit card payment", split_loan_payment:"Other debt payment", split_enjoy_next:"Enjoy next month", split_invest_remainder:"Invest (remainder)", tour1_title:"Your dashboard", tour1_body:"See if this month's baseline is covered, track your momentum, and know exactly how much is set aside.", tour2_title:"Log your gigs", tour2_body:"Every payment gets logged here. The app splits it automatically — tax, dues, savings, invest, enjoy-life — the moment you save it.", tour3_title:"Reports & tools", tour3_body:"Pull an accountant-ready summary, generate an invoice, or check your investment tracker — all built from the gigs you've logged.", tour4_title:"Make it yours", tour4_body:"Adjust your baseline, tax rates, and savings goals anytime, name your real accounts, switch languages, or replay tips — it's all here.", tour_next:"Next", tour_back:"Back", tour_done:"Got it", dash_baseline_covered:"Baseline covered", dash_to_go:"{amt} to go", dash_no_income:"No income this month yet", dash_income_label:"Income this month", dash_baseline_label:"Baseline", dash_spending_title:"Spending money this month", dash_spending_sub:"from last month's enjoy-life allocation", dash_coverage:"Coverage", dash_runway_sub:"months of runway", dash_saved_invested:"Saved & invested", dash_saved_sub:"of net income, last 90 days", dash_net_ytd:"Net income YTD", dash_net_ytd_sub:"after tax set-aside", dash_setaside_sub:"parked this year", dash_debt_label:"Debt", dash_total_owing:"Total owing", dash_paid_down:"Paid down this year", dash_selfloan_label:"Self-loan", dash_owed_self:"Currently owed to yourself", dash_repaid_year:"Repaid this year", dash_momentum_sub:"What your surplus built each month", dash_leg_savings:"Savings & investing", dash_leg_debt:"Debt payoff", dash_recent_gigs:"Recent gigs", dash_no_gigs:"No gigs yet. Tap + to log your first one.", exp_invest:"Invest", exp_cc:"Credit card", exp_other_debt:"Other debt", exp_no_activity:"No activity that month", exp_all_years:"Checks all years, all received gigs — not just {year}", dash_in_account:"In {account}", det_date:"Date", det_type:"Type", det_cartage:"Cartage / tips", det_surplus:"Surplus this gig", det_selfloan_repaid:"Self-loan repaid", det_edit_entry:"Edit this entry", det_remove_entry:"Remove this entry", det_type_freelance:"Freelance", det_type_employment:"Employment", det_type_instruction:"Instruction", det_type_other:"Other", rep_your_reports:"Your reports", rep_free_tools:"Free tools", rep_card_accountant_title:"For your accountant", rep_card_accountant_sub:"Business income, tax, pension, deductions", rep_card_giglog_title:"Gig log", rep_card_giglog_sub:"All income entries for the tax year", rep_card_snapshot_title:"Year-end snapshot", rep_card_snapshot_sub:"Your full financial year in review", rep_card_invest_title:"Investment tracker", rep_card_invest_sub:"Contributions by account type", rep_card_audit_title:"Set-aside transfer audit", rep_card_audit_sub:"Checks every gig against the correct formula", rep_card_invoice_title:"Invoice generator", rep_card_invoice_sub:"Create a professional invoice in seconds", rep_tax_year:"Tax year", rep_total_entries:"Total entries", rep_total_gross:"Total gross", rep_total_net_liquid:"Total net liquid", rep_net_income:"Net income", rep_total_to:"Total to {account}", rep_enjoy_total:"Enjoy-life total", rep_savings_total:"Savings total", rep_invested_total:"Invested total", rep_debt_paid:"Debt paid down", rep_building_future:"Building future %", rep_total_invested_auto:"Total invested (automatic remainder)", rep_bucket_ytd:"{name} YTD", rep_no_gigs_logged:"No gigs logged yet", rep_acct_freelance_note:"Freelance & other income only — T4 employment excluded", rep_col_gross:"Gross", rep_col_hst:"HST", rep_col_dues:"Dues", rep_col_taxset:"Tax set", rep_no_freelance:"No freelance income found for {year}", rep_totals:"Totals", inv_free_note_strong:"Free for everyone.", inv_free_note_body:"Fill in the details below and tap \"Preview invoice\" to see your finished invoice, then save it as a PDF from your browser's print menu (File → Print → Save as PDF).", inv_your_details:"Your details", inv_your_name_label:"Your name / business name", inv_your_name_ph:"Your Name", inv_your_addr_label:"Your address", inv_your_addr_ph:"123 Main St, Toronto, ON M5V 1A1", inv_email_label:"Email", inv_phone_label:"Phone (optional)", inv_client_details:"Client details", inv_client_name_label:"Client name / organization", inv_client_name_ph:"Client Name", inv_client_addr_label:"Client address", inv_client_addr_ph:"123 Main St, City, Province/State", inv_details_title:"Invoice details", inv_num_label:"Invoice #", inv_num_ph:"INV-001", inv_due_label:"Due date", inv_line_items:"Line items", inv_add_line:"Add line item", inv_line_desc_ph:"Description (e.g. Performance fee)", inv_premium_label:"Apply premium / markup?", inv_premium_no:"No premium", inv_premium_yes:"Yes — add a percentage", inv_premium_pct_label:"Premium %", inv_tax_label:"Include sales tax?", inv_tax_no:"No — exempt or not registered", inv_tax_yes:"Yes — include sales tax", inv_tax_rate_label:"Tax rate %", inv_tax_reg_label:"Tax registration number", inv_tax_reg_ph:"123456789 RT0001", inv_payment_label:"Payment instructions", inv_payment_ph:"e-Transfer to you@email.com within 30 days", inv_preview_btn:"Preview invoice", inv_preview_label:"Preview", inv_save_pdf_note:"To save as PDF: tap the share/print button in your browser and choose \"Save as PDF\" or \"Print to PDF\".", inv_title:"Invoice", inv_num_prefix:"# {num}", inv_date_prefix:"Date: {date}", inv_due_prefix:"Due: {date}", inv_from:"From", inv_billto:"Bill to", inv_col_amt:"Amount", inv_subtotal:"Subtotal", inv_premium_row:"Premium ({pct}%)", inv_taxrow:"Sales tax ({pct}%)", inv_tax_reg_suffix:" — Reg #{reg}", inv_total:"Total", inv_payment_prefix:"Payment:", settings_page_title:"Settings", set_h_display:"Display", set_learning_mode:"Learning mode", set_learning_desc:"Show helpful explanations throughout the app. Turn off once you know the system.", set_h_accounts:"Your accounts", set_accounts_note:"Optional — just for your reference. Helps you remember which account is which when the app says \"move to your set-aside account.\"", set_chequing_label:"Chequing account", set_chequing_ph:"e.g. TD Chequing", set_setaside_label:"Set-aside account (high-interest savings)", set_setaside_ph:"e.g. EQ Bank HISA, Tangerine Savings", set_invest_label:"Investment account", set_invest_ph:"e.g. Wealthsimple RRSP, Questrade TFSA", set_h_monthly_costs:"Monthly costs", set_total_baseline:"Total baseline", set_edit_costs:"Edit monthly costs", set_h_tax:"Tax settings", set_currency_label:"Currency symbol", set_taxsetaside_label:"Tax set-aside", set_salestax_rate_label:"Sales tax rate", set_edit_tax:"Edit tax settings", set_h_funfund:"Fun fund", set_carryover_label:"Carry over unspent amount", set_carryover_desc:"When off, your fun fund resets each month to last month's enjoy-life allocations.", set_h_buffer:"Buffer month", set_buffer_label:"I maintain a buffer month", set_buffer_desc:"This is a reminder toggle for your own reference — it doesn't change calculations. If you pay yourself from last month's income on the 1st, log it as a regular gig with that date. The baseline check works the same way.", set_h_savings_goals:"Savings goals", set_edit_savings:"Edit savings goals", set_h_balances:"Account balances", set_balances_desc:"Enter your current balances to calculate your months of coverage (runway). Update whenever you like.", set_checking_label:"Checking ($)", set_savings_setaside_label:"Savings / set-aside account ($)", set_tfsa_label:"Tax-free savings ($)", set_invest_accounts_label:"Investment accounts ($)", set_h_debt:"Debt balances", set_debt_desc:"Track what you owe so the momentum chart shows your payoff progress.", set_cc_owing_label:"Credit card total owing ($)", set_selfloan_desc:"Money you've borrowed from yourself — out of savings or investing surplus, to be repaid on your own terms. Tracked separately because you owe it to yourself, not a creditor.", set_selfloan_add_label:"Add to self-loan owed ($)", set_add_amount:"Add this amount", set_exact_balances:"Set exact balances", set_h_data:"Your data", set_data_desc:"Export your data to keep a backup or to transfer it to a future version of the app. Your data never leaves your device unless you export it.", set_export_btn:"Export my data (backup)", set_import_btn:"Import data from backup", set_h_legal:"Legal", set_terms_btn:"Terms & disclaimer", set_readiness_btn:"Account setup guide", set_copyright:"artisticAutonomy™ — © 2026 Alejandro Céspedes. All rights reserved.", set_h_advanced:"Advanced settings", hm_invest_label:"Invest", hm_invest_sub:"grows in {account} over time", tip_buffer_month:"Track a \"buffer month\" for your own reference — if you paid yourself from last month's income on the 1st, just log it as a regular gig dated that day. It's a habit, not a setting.", checkin_intro:"A few minutes as CEO of your own life — let's see where things stand.", checkin_step1_title:"Investing check", checkin_step1_body:"You've built up roughly {amt} toward investing this quarter. Has it landed in {account}, or is it still sitting as cash?", checkin_step1_yes:"Yes, it's invested", checkin_step1_no:"Not yet — remind me next time", checkin_step2_title:"Set-aside receipt", checkin_step2_body:"Right now you should have about {total} in {account} — roughly {gov} of that is government money, the rest ({rest}) is savings and enjoy-life waiting their turn.", checkin_step2_gotit:"Got it", checkin_step2_reminder:"This account is meant to hold government money and short-term savings only. Any interest it earns should usually move to your investment account too — not stay here.", checkin_step3_title:"Money dials", checkin_step3_body:"What do you want your enjoy-life money to go toward these next few months?", checkin_tag_travel:"Travel", checkin_tag_gear:"Gear / instruments", checkin_tag_dining:"Dining out", checkin_tag_family:"Family", checkin_tag_other:"Something else", checkin_finish:"Finish", checkin_tip:"Check in every few months on your investing, your set-aside account, and what you want your enjoy-life money to go toward. Tap anytime to run it early — the clock just resets.", invest_trend_up:"↑ {pct}% invested — up from {prev}%", invest_trend_down:"↓ {pct}% invested — down from {prev}%", invest_trend_flat:"{pct}% invested — steady with last period", invest_trend_tip:"This shows how much of your income you're setting aside to invest — not how your investments are performing in the market.", checkin_add_tag:"Add your own", checkin_tag_placeholder:"e.g. Camera lens", checkin_tag_add_btn:"Add", checkin_header_label:"Quarterly check-in", bkt_goal_label:"Goal (optional)", bkt_goal_ph:"e.g. 6000", rep_card_goals_title:"Goals progress", rep_card_goals_sub:"How close you are, and when you'll get there", goals_none_set:"No goals set yet — add a target amount to any savings goal in Settings to see your progress here.", goals_reached:"🎉 Goal reached!", goals_projected:"On pace for {date} at your recent rate", goals_no_recent_pace:"No recent contributions — pace unknown", goals_alltime_note:"All-time progress, regardless of year selected", goal_reached_announce:"🎉 Goal reached! Your {name} goal was fully funded with this payment. That percentage now redirects to investing — one more habit working for your future. Adjust or start a new goal anytime in Settings.", goals_mark_spent:"Mark as spent, start fresh", exp_rent:"Rent / Mortgage", exp_groceries:"Groceries", exp_utilities:"Utilities", exp_transit:"Transit / Car", exp_childcare:"Childcare", exp_other:"Other fixed costs", audit_col_stored:"Stored", audit_col_correct:"Correct", audit_col_diff:"Diff", audit_total_short:"Total you’re short in {account}", audit_positive_note:"A positive Diff means more should have moved to {account} than actually did — top up your real account by that gig’s amount. Tap a gig in the Gigs list to edit and re-save it, which recalculates and corrects the stored figure here too.", audit_no_discrepancies:"No discrepancies found — every received gig matches the correct formula.", audit_historical_tag:"(historical)", flag_debt_before_baseline:"Payment made before baseline covered this month", dash_momentum_header:"Momentum", momentum_all:"All", momentum_sub_year:"What your surplus built each month", momentum_sub_all:"Your progress year by year", lifetime_saved_invested:"Total saved &amp; invested", lifetime_debt_paid:"Total debt paid off", lifetime_since:"Since you started",
  inv_adjustments_title:"Adjustments", inv_adjustments_desc:"Premiums, sales tax, union dues, discounts — anything that adds to or subtracts from the subtotal. Each can carry an optional reference note (e.g. a tax registration or union member number) shown in parentheses on the invoice.", inv_add_adjustment:"Add adjustment", inv_hours_ph:"Hours", inv_rate_ph:"Rate/hr", inv_mode_flat:"Flat", inv_mode_hourly:"Hourly", inv_amount_ph:"$ Amount", inv_adj_label_ph:"Label, e.g. Doubling, HST, Union Dues", inv_adj_refnote_ph:"Optional reference note, e.g. 123456789 RT0001", inv_adj_type_flat:"$ flat", inv_adj_dir_add:"+ Add", inv_adj_dir_subtract:"− Subtract", inv_adj_empty_note:"No adjustments yet. Use these for premiums, sales tax, union dues, or discounts — each is calculated from the subtotal.", inv_adjustment_default:"Adjustment",
  progress_card_title:"Your Progress", progress_card_sub:"Your lifetime efficiency score, streaks, and records", progress_locked_caption:"Premium feature", progress_locked_screen_msg1:"This is a premium feature.", progress_locked_screen_msg2:"Premium access isn't available for your account yet.", progress_eff_label:"Efficiency score", progress_eff_caption:"A lifetime blend of your savings rate, debt payoff, self-loan health, and goal progress — different from the \"Saved & invested\" number on your dashboard, which only looks at the last 90 days.", progress_streaks_label:"Streaks", progress_streaks_empty:"Log a few gigs to start tracking your streaks.", progress_baseline_paused:"Your baseline streak paused at {months} — that's normal for freelance work. If things are slow right now, would a short-term side gig make sense to bridge the gap?", progress_baseline_none_yet:"No baseline-covered streak going yet — that's normal for freelance work. Every gig that clears baseline starts one.", progress_streak_in_a_row:"{months} in a row", progress_invest_no_covered_yet:"Once you cover baseline for a month, we'll start tracking your investing streak here.", progress_invest_paused:"Investing streak paused. Let's build that back up!", progress_invest_label:"Invested something", progress_records_label:"Personal records", progress_biggest_gig_label:"Biggest single gig", progress_best_month_label:"Best month", progress_longest_streak_label:"Longest baseline streak", progress_timetogoal_label:"Time to your number", progress_no_goals_msg:"No savings goals with a target amount set yet — add one in Settings → Savings goals.",
  inv_logo_title:"Logo (premium)", inv_logo_upload:"Upload logo", inv_logo_replace:"Replace", inv_logo_remove:"Remove", inv_logo_hint:"PNG or JPG, up to 5MB. Resized automatically to keep things fast.", inv_logo_bad_type:"Please choose a PNG or JPG image.", inv_logo_too_large:"That file is too large — please choose an image under 5MB.",
  rep_excel_locked_note:"Excel export is a premium feature.", rep_export_field:"Field", rep_export_value:"Value", rep_export_goal:"Goal", rep_export_saved:"Saved", rep_export_target:"Target", rep_export_status:"Status",
  export_popup_blocked:"Your browser blocked the popup. Please allow popups for this site and try again.", export_lib_failed:"Couldn't load the Excel export tool. Check your connection and try again.",
  inv_export_btn:"Export / print invoice",
  export_default_name:"My Business", export_footer_invoice:"Prepared with artisticAutonomy™ | artisticautonomy.ca", export_footer_report:"Generated by artisticAutonomy™ | artisticautonomy.ca", progress_peak_efficiency:"🏆 Peak efficiency! You're excelling across every dimension.",
  auth_sub_line1:"Financial toolkit for creative professionals.", auth_sub_login_line2:"Sign in to continue.", auth_sub_signup_line2:"Create your account to get started.", auth_login_btn:"Log in", auth_signup_btn:"Create account", auth_toggle_to_signup:"Need an account? Sign up", auth_toggle_to_login:"Already have an account? Log in", auth_err_missing_fields:"Please enter both email and password.", auth_msg_check_email:"Account created! Check your email to confirm, then log in.", auth_err_generic:"Something went wrong. Please try again.", set_h_account:"Account", set_logged_in_as:"Logged in as", set_logout_btn:"Log out",
  auth_forgot_link:"Forgot password?", auth_back_to_login:"Back to log in", auth_reset_send_btn:"Send reset link", auth_sub_reset_line2:"Enter your email to get a reset link.", auth_set_new_password_btn:"Set new password", auth_sub_setnew_line2:"Choose a new password.", auth_new_password_ph:"New password", auth_err_missing_email:"Please enter your email.", auth_err_missing_password:"Please enter a new password.", auth_msg_reset_sent:"Check your email for a password reset link.", auth_msg_password_updated:"Password updated! Please log in.", auth_password_field_label:"Password", auth_confirm_password_ph:"Confirm password", auth_err_password_mismatch:"Passwords don't match.", auth_resend_btn:"Resend confirmation email", auth_msg_resend_sent:"Confirmation email resent — check your inbox.", auth_existing_account_msg:"This email already has an account.", auth_existing_account_login_btn:"Log in instead", auth_existing_account_reset_btn:"Reset password", auth_resend_cooldown:"Resend available in {s}s", set_change_pw_title:"Change password", set_change_pw_btn:"Update password", set_pw_msg_updated:"Password updated!"
},
es:{
  lang_title:"Elige tu idioma", lang_sub:"Puedes cambiarlo cuando quieras desde Ajustes.",
  lang_en:"English", lang_es:"Español", lang_fr:"Français", lang_confirm:"Continuar",
  nav_dashboard:"Inicio", nav_gigs:"Trabajos", nav_reports:"Informes",
  onb1_title:"Tu base mensual", onb1_sub:"Añade cada gasto fijo — alquiler, comida, servicios, cuidado infantil. Este es el número con el que se mide tu ingreso cada mes.",
  onb1_add_expense:"Añadir gasto", onb1_baseline_label:"Base mensual", onb1_continue:"Continuar", onb1_suggestion_note:"Los números en gris son sugerencias aproximadas de inicio — escribe tu monto real para reemplazarlos.", terms_title:"Términos y descargo de responsabilidad", terms_p1:"artisticAutonomy™ es una herramienta propiedad de Alejandro Céspedes. El nombre, la marca, el diseño y el código subyacente están protegidos por derechos de autor y marca registrada. Esta versión beta se comparte de forma privada solo para fines de prueba y no está autorizada para redistribución, copia o reutilización comercial.", terms_p2_strong:"No es asesoría financiera.", terms_p2:"Esta app es una herramienta de organización y educación. No ofrece asesoría financiera, fiscal, legal ni de inversión. Los cálculos se basan en los porcentajes y ajustes que tú ingresas.", terms_professional_strong:"Cuándo hablar con un profesional real.", terms_professional_intro:"Esta app te ayuda a organizar y entender tus números — no sustituye una asesoría personalizada. Habla con un contador, profesional de impuestos o asesor financiero calificado cuando:", terms_prof_1:"Te registres para cobrar impuesto sobre ventas (HST/GST/IVA) por primera vez, o no estés seguro si debes hacerlo", terms_prof_2:"Recibas una factura de impuestos que te sorprenda, o estés atrasado en pagos de impuestos", terms_prof_3:"Estés lidiando con deudas más allá de lo que un plan de pago simple puede resolver", terms_prof_4:"Recibas un pago único grande o una entrada de dinero inesperada", terms_prof_5:"Estés a pocos años de jubilarte, o planeando un cambio importante de vida", terms_prof_6:"Tu situación involucre múltiples tipos de ingreso, provincias/estados o países", terms_p3_strong:"Tus datos.", terms_p3:"Toda la información que ingresas permanece en tu propio dispositivo, guardada localmente en tu navegador. Esta app nunca la transmite ni la guarda en ningún servidor externo. Eres responsable de respaldar tus datos usando la función de exportar, ya que borrar los datos de tu navegador los eliminará.", terms_p4_strong:"Software beta.", terms_p4:"Esta app está en desarrollo activo. Las funciones, cálculos y estructuras de datos pueden cambiar. Aunque se procura mantener tus datos intactos entre actualizaciones, no se garantiza contra pérdida de datos — exporta copias de seguridad con regularidad.", terms_got_it:"Entendido",
  onb2_title:"Configuración de impuestos", onb2_sub:"Esto determina cada cálculo. Los valores por defecto son para Ontario — ajústalos según tu provincia o país.",
  onb2_currency_label:"Símbolo de moneda", onb2_currency_other_label:"Tu símbolo de moneda",
  onb2_tax_label:"% de reserva de impuestos (incluye aportes a pensión)", onb2_hst_label:"% de impuesto sobre ventas", onb2_dues_label:"% de cuotas sindicales/gremiales",
  onb2_note:"Tu reserva de impuestos cubre el impuesto sobre la renta y los aportes a pensión. Si no estás seguro, 32-35% es un buen punto de partida para la mayoría de freelancers — ajústalo según tu caso.",
  onb2_continue:"Continuar", onb2_back:"Atrás",
  onb3_title:"Tus metas de ahorro", onb3_sub:"Nombra tus categorías de ahorro y asigna un porcentaje del excedente de cada trabajo. Fondo de vacaciones, fondo de emergencia, instrumento nuevo — lo que sea importante para ti.",
  onb3_note:"Esto es tu excedente. Cada dólar tiene un destino — disfrutar el próximo mes, ahorrar o invertir.",
  onb3_bucket_name_placeholder:"ej. Fondo de vacaciones", onb3_pct_left_prefix:"Restante para invertir:",
  onb3_continue:"Continuar", onb3_back:"Atrás",
  onb4_title:"Inversión", onb4_sub:"Lo que sobre después de impuestos, cuotas, tus metas de ahorro y el disfrute mensual va automáticamente a Inversión — sin dividir ni nombrar nada. Abre una cuenta de inversión autogestionada (o el equivalente en tu país) y asegúrate de que ese excedente realmente se invierta una vez llegue ahí.",
  onb4_enjoy_label:"% para disfrutar (del excedente restante)", onb4_start:"Empezar a registrar", onb4_back:"Atrás",
  dash_this_month:"Este mes", dash_status_label:"Estado", settings_language:"Idioma", settings_change_language:"Cambiar idioma", tip_gated_status:"Esto muestra si tu base de este mes ya está cubierta — el excedente solo se reparte una vez que lo esté.", tip_setaside:"Este es el total acumulado que debería estar en tu cuenta de separada real, no solo registrado aquí.", tip_momentum:"Toca una barra para ver exactamente a dónde fue el excedente de ese mes.", tip_historical:"Usa esto para trabajos que ya ocurrieron — ingresa lo que realmente pasó en lugar de que la app lo calcule.", settings_tips_section:"Consejos", settings_replay_tips:"Repetir consejos", settings_guided_tour:"Hacer el recorrido guiado", gloss_page_title:"Glosario", gloss_h_setaside:"Cuenta de separada", gloss_p_setaside:"Una cuenta de ahorro de alto interés donde tu reserva de impuestos, categorías de ahorro y asignación de disfrute se guardan después de cada trabajo, ganando interés mientras esperan. En Canadá esto es una HISA (High-Interest Savings Account); en EE.UU., una HYSA (High-Yield Savings Account). Si estás en otro lugar, busca el equivalente en tu banco: una cuenta de ahorro de alto rendimiento, cuenta con aviso previo, o similar. El concepto es el mismo en todas partes: el dinero gana interés mientras espera, en lugar de quedarse inactivo.", gloss_h_baseline:"Base", gloss_p_baseline:"Tus costos fijos mensuales totales — alquiler, servicios, comida, seguro, todo lo que sale cada mes sin importar si trabajaste o no. Este es el número contra el que se mide tu ingreso. Una vez cubierto, se desbloquea el excedente.", gloss_h_gated:"Excedente limitado", gloss_p_gated:"El monto disponible para asignar a ahorro e inversión — pero solo después de que la base esté completamente cubierta ese mes. El límite protege tus costos fijos antes de que se mueva cualquier otra cosa.", gloss_h_salestax:"Impuesto sobre ventas", gloss_p_salestax:"Impuesto cobrado a los clientes en nombre del gobierno, añadido sobre tu tarifa. En Canadá esto es HST o GST. En Europa es IVA. En Latinoamérica, IVA. En Australia, GST. El concepto y el manejo que hace la app son idénticos sin importar cómo lo llame tu país. Solo aplica si estás registrado para cobrarlo — verifica el umbral local.", gloss_h_workdues:"Cuotas sindicales/gremiales", gloss_p_workdues:"Cuotas pagadas a una asociación profesional o sindicato, calculadas como porcentaje de tu tarifa base. En Canadá esto suele aplicar a miembros de la AFM (sindicato de músicos). Fuera de Canadá tu equivalente podría ser el Musicians' Union (Reino Unido), ISMA, u otro organismo. Si no perteneces a un sindicato o asociación, desactiva esto — no afectará tus cálculos.", gloss_h_enjoy:"Asignación de disfrute", gloss_p_enjoy:"Un porcentaje deliberado de tu excedente reservado para gastar sin culpa. Se guarda en tu cuenta de separada mientras espera, y luego vuelve a ahorros el día 1 de cada mes — listo para recargar tu cuenta corriente a medida que lo gastas. El disfrute intencional es parte de un plan financiero sostenible.", gloss_h_saved:"Ahorrado e invertido", gloss_p_saved:"El porcentaje de tu ingreso neto en los últimos 90 días que fue hacia categorías de ahorro o inversión. Más alto significa que más de tus ingresos están trabajando para tu futuro en lugar de solo pasar de largo.", gloss_h_funfund:"Fondo de disfrute", gloss_p_funfund:"Las asignaciones de disfrute del mes pasado, liberadas el día 1 de este mes como tu límite de gasto. La app no rastrea en qué lo gastas — eso es intencional. Cualquier monto no gastado se acumula o se reinicia, según tu configuración.", gloss_h_selfloan:"Préstamo propio", gloss_p_selfloan:"Dinero que tomaste prestado de tu propio excedente — no de un acreedor, sino de tus ahorros o inversión futura. Se rastrea por separado porque la obligación es contigo mismo, no con un prestamista. Regístralo cuando redirijas excedente para una necesidad inmediata, y devuélvelo con trabajos futuros cuando la situación lo permita.", gloss_h_taxsetaside:"Reserva de impuestos", gloss_p_taxsetaside:"El porcentaje que reservas de cada trabajo para cubrir tu impuesto sobre la renta y aportes a pensión al final del año. Tu contador puede confirmar el número correcto para tu situación. Si no estás seguro: 32% es un buen punto de partida para la mayoría de freelancers canadienses; 35% es más seguro si quieres evitar una sorpresa; fuera de Canadá, investiga tu tasa de impuesto de trabajador independiente — casi siempre es más alta que la de los empleados.", btn_back:"Atrás", hiw_page_title:"Cómo funciona", hiw_h_core:"La idea central", hiw_p_core:"Cada trabajo que ganas pasa por una secuencia simple: primero las obligaciones con el gobierno, luego tus costos base, y solo después de cubrir eso, el resto es tuyo para asignar intencionalmente.", hiw_h1:"1. Impuestos + cuotas → cuenta de separada de inmediato", hiw_p1:"En el momento en que registras un trabajo, se calcula la parte del gobierno y se marca para tu cuenta de ahorro de alto interés. Ahí gana interés hasta que se necesite — y se mantiene separada para que nunca tengas la tentación de gastarla.", hiw_h2:"2. La base se cubre primero", hiw_p2:"Tu ingreso neto se acumula mes a mes. Solo después de cubrir tu base se desbloquea el excedente. Esto asegura que tus costos fijos nunca estén en riesgo. Para cubrir tu base más rápido, considera aumentar tus ingresos — más trabajos, contrataciones mejor pagadas, o una fuente de ingreso complementaria junto a tu trabajo creativo. Muchos músicos activos financian su arte con trabajo paralelo que no lo compromete — les da el margen financiero para hacer más de lo que aman.", hiw_h3:"3. El excedente se reparte intencionalmente", hiw_p3:"El excedente se divide entre disfrute, tus categorías de ahorro e inversión. Tú defines los porcentajes y puedes cambiarlos cuando quieras en Ajustes. Importante: incluso cuando tienes pagos de deuda, la app siempre reserva una parte para disfrute e inversión. Esto es intencional — la disciplina de avanzar algo con cada pago, por pequeño que sea, es el hábito que construye salud financiera con el tiempo. La deuda se aborda a través del excedente, nunca eliminando por completo el ahorro y la inversión.", hiw_h_accounts:"Las cuentas que hacen que esto funcione", hiw_p_accounts_intro:"No necesitas abrir todo de una vez — pero tener tres cuentas separadas hace que este sistema sea mucho más claro en la práctica.", hiw_h_chequing:"Cuenta corriente — tu cuenta de transacciones", hiw_p_chequing:"El gasto del día a día pasa por aquí. Mantén solo lo que necesitas para la semana actual. Todo lo demás gana más interés en otro lugar.", hiw_h_savings:"Ahorros y tu cuenta de separada — tus dos cuentas de espera", hiw_p_savings:"Cumplen propósitos distintos. Tu cuenta de ahorros es donde vive tu base entre trabajos — alimenta la cuenta corriente a medida que llegan las cuentas por pagar. Tu cuenta de separada (una cuenta de ahorro de alto interés, o el equivalente en tu banco) es donde tu reserva de impuestos, tus categorías de ahorro y tu asignación de disfrute se guardan después de cada trabajo — ganando interés mientras esperan. El día 1 de cada mes, tu asignación de disfrute pasa de la cuenta de separada de vuelta a ahorros, desde donde recarga tu cuenta corriente a medida que gastas durante el mes. Una cuenta de separada de alto interés gana significativamente más que una cuenta de ahorros común — vale la pena cambiarte si aún no lo has hecho.", hiw_h_invest:"Cuenta de inversión — tu cuenta de futuro", hiw_p_invest:"A dónde va y se queda la parte de inversión. Importante: abrir la cuenta es el primer paso, pero el dinero realmente necesita invertirse una vez que llega ahí — colocado en un fondo indexado, ETF, u otro vehículo. Una cuenta con el dinero solo en efectivo no es invertir. Este es un proceso de dos pasos que mucha gente pasa por alto. En qué inviertes es tu decisión — investiga por tu cuenta y habla con un profesional sobre lo que es correcto para tu situación específica. Esta app no da asesoría de inversión.", hiw_h_percentages:"Definiendo tus porcentajes", hiw_p_percentages_intro:"¿No sabes qué porcentajes usar para tus categorías de ahorro? Aquí tienes un marco práctico para empezar.", hiw_h_math:"La matemática es simple", hiw_p_math:"Meta anual ÷ ingreso freelance anual = porcentaje por trabajo. Si ganas aproximadamente $30,000 como freelancer y quieres reservar $6,000 para unas vacaciones, eso es $6,000 ÷ $30,000 = 20%. Configura tu categoría de vacaciones al 20% y cada trabajo moverá automáticamente el 20% de su excedente hacia esa meta.", hiw_h_example:"Ejemplo — freelancer canadiense", hiw_p_example:"Ingreso anual: $30,000. Meta de vacaciones: $6,000 → 20%. Meta de aporte a TFSA: $7,000 → 24%. Reserva de impuestos: 35% (cubre impuesto sobre la renta + aportes a pensión). Después de impuestos, vacaciones y TFSA, aproximadamente 50-55% de cada excedente va a inversión o pago de deudas — un porcentaje saludable de construcción de futuro. Ajusta esto según tus metas reales y tus obligaciones fiscales locales. Tu contador puede confirmar la tasa de impuesto correcta para tu situación.", hiw_h_gated_reminder:"El recordatorio del excedente limitado", hiw_p_gated_reminder:"Estos porcentajes aplican solo a tu excedente — lo que queda después de cubrir tu base mensual. Si un trabajo no logra cubrir la base, nada se reparte todavía. Todo el trabajo va hacia cubrir la base primero, y el reparto se abre con el siguiente trabajo que te haga superarla.", hiw_h_enjoy_flow:"El flujo de tu dinero de disfrute", hiw_h_where:"A dónde va y cuándo", hiw_p_where:"La asignación de disfrute de cada trabajo se guarda en tu cuenta de separada junto con el dinero de impuestos — gana interés mientras espera. El día 1 de cada mes, mueve ese monto de vuelta a tu cuenta de ahorros. Luego recarga la cuenta corriente desde ahorros a medida que realmente lo gastas durante el mes. La app muestra tu dinero disponible para gastar en el banner \"Dinero para disfrutar este mes\" del panel principal.", gig_hist_toggle_label:"Entrada histórica", default_setaside_name:"tu cuenta de separada", default_invest_name:"tu cuenta de inversión", default_chequing_name:"tu cuenta corriente", gig_edit_title:"Editar trabajo", btn_save_changes:"Guardar cambios", hm_tax_dues_note:"Impuestos + cuotas: {amt} — permanece en tu cuenta de separada hasta que se necesite", hm_gov_label:"Reserva de impuestos", hm_gov_sub:"permanece en tu cuenta de separada hasta la temporada de impuestos", hm_savings_label:"Metas de ahorro", hm_savings_sub:"permanece ahí hasta que lo necesites", hm_enjoy_label:"Asignación de disfrute", hm_enjoy_sub:"vuelve a ahorros el día 1", gig_title:"Registrar un trabajo", gig_date:"Fecha", gig_date_err:"Agrega una fecha", gig_status:"Estado", gig_status_received:"Recibido", gig_status_pending:"Pendiente", hist_note:"Ingresa lo que realmente pasó en lugar de que la app lo calcule", hist_what_happened:"Lo que realmente pasó", hist_scale_fee:"Tarifa base ($)", hist_cartage:"Transporte / propinas ($)", hist_tax:"Reserva de impuestos ($)", hist_hst:"Impuesto sobre ventas ($)", hist_dues:"Cuotas sindicales/gremiales ($)", hist_net:"Neto líquido ($)", hist_enjoy:"Disfrute próximo mes ($)", hist_invest:"Invertido ($)", hist_cc:"Tarjeta de crédito pagada ($)", hist_loan:"Otra deuda pagada ($)", hist_sl_borrow:"Préstamo propio recibido ($)", hist_sl_repay:"Préstamo propio devuelto ($)", hist_income_type:"Tipo de ingreso", hist_type_freelance:"Independiente / Freelance", hist_type_employment:"Empleo (T4 — impuesto en la fuente)", hist_type_other:"Otro", hist_notes:"Notas", hist_notes_ph:"ej. T4, HST no cobrado, pago en efectivo...", hist_transfer_header:"Transferencia a cuenta de separada (impuestos + cuotas)", gig_desc:"Descripción", gig_desc_ph:"ej. Concierto, ensayo, presentación, evento", gig_desc_err:"Agrega una descripción", gig_payer:"Pagador", gig_payer_ph:"Organización o persona", gig_payer_err:"Agrega el pagador", gig_income_type:"Tipo de ingreso", gig_type_freelance:"Independiente / freelance", gig_type_employment:"Empleo (impuesto retenido en la fuente)", gig_type_other:"Otro", check_helper_title:"Calculadora de cheque (opcional)", check_amount_label:"Monto del cheque", check_calc_label:"Tarifa base calculada", check_helper_note:"Ingresa el pago recibido y se estimará la tarifa base. Confírmalo con tu factura y luego se completa abajo automáticamente.", gig_scale_fee:"Tarifa base", gig_scale_fee_err:"Agrega una tarifa base", gig_cartage:"Transporte / propinas ($)", apply_sales_tax:"Aplicar impuesto sobre ventas a este trabajo", apply_work_dues:"Aplicar cuotas sindicales a este trabajo", debt_payments_title:"Pagos de deuda de este trabajo (opcional)", debt_cc_label:"Tarjeta de crédito ($)", debt_loan_label:"Otra deuda ($)", debt_note:"Sale del excedente de este trabajo, el mismo dinero que de otro modo iría a disfrute, ahorro o inversión.", selfloan_title:"Préstamo propio (opcional)", selfloan_borrow_label:"Tomar prestado de este trabajo ($)", selfloan_repay_label:"Devolvértelo a ti mismo ($)", selfloan_tip:"Dinero que te debes a ti mismo, separado de una deuda con un acreedor. Tomar prestado sale del excedente de este trabajo — dinero ya destinado a ahorro o inversión. “Devolvértelo a ti mismo” reduce lo que te debes, igual que un pago de deuda reduce lo que le debes a un acreedor.", gig_notes:"Notas (opcional)", gig_notes_ph:"Cualquier nota sobre este trabajo", split_where:"A dónde va esto", gig_hisa_tip:"Reserva de impuestos + aportes a pensión. Guarda esto en tu cuenta de ahorro de alto interés — gana interés hasta que se necesite y se mantiene separado para que no sea tentador gastarlo.", btn_add_gig:"Añadir trabajo", btn_cancel:"Cancelar", gig_logged_title:"Trabajo registrado", hm_tip:"Todo gana interés mientras espera. Esto es lo que contiene:", hm_sub_logged:"“{name}” está registrado.", hm_sub_historical:"“{name}” registrado como entrada histórica.", hm_move_now:"Mueve a {account} ahora", hm_transfer:"Transferir a {account}", split_income_tax:"Reserva de impuesto sobre la renta", split_sales_tax:"Impuesto sobre ventas cobrado", split_work_dues:"Cuotas sindicales", split_net_liquid:"Neto líquido", split_baseline_covered:"La base de este mes ya está cubierta", split_toward_baseline:"Este trabajo va hacia tu base ({amt} aún necesario)", split_surplus:"Excedente de este trabajo: {amt}", split_selfloan_capped:"Préstamo limitado al excedente disponible ({amt}) — no puedes tomar más de lo que generó este trabajo", split_selfloan_repay_capped:"Devolución limitada al excedente restante — no queda suficiente en este trabajo para devolver esa cantidad", split_cc_capped:"Pago de tarjeta de crédito limitado — no queda suficiente excedente en este trabajo", split_loan_capped:"Pago de otra deuda limitado — no queda suficiente excedente en este trabajo", split_selfloan_borrowed:"Préstamo propio recibido", split_paying_back:"Devolviéndotelo a ti mismo", split_cc_payment:"Pago de tarjeta de crédito", split_loan_payment:"Pago de otra deuda", split_enjoy_next:"Disfrute próximo mes", split_invest_remainder:"Invertir (remanente)", tour1_title:"Tu inicio", tour1_body:"Revisa si la base de este mes está cubierta, sigue tu progreso y sabe exactamente cuánto tienes en tu cuenta de separada.", tour2_title:"Registra tus trabajos", tour2_body:"Cada pago se registra aquí. La app lo reparte automáticamente — impuestos, cuotas, ahorro, inversión, disfrute — en el momento en que lo guardas.", tour3_title:"Informes y herramientas", tour3_body:"Genera un resumen listo para tu contador, crea una factura, o revisa tu seguimiento de inversiones — todo construido a partir de los trabajos que registraste.", tour4_title:"Hazla tuya", tour4_body:"Ajusta tu base, tasas de impuestos y metas de ahorro cuando quieras, nombra tus cuentas reales, cambia de idioma, o repite los consejos — todo está aquí.", tour_next:"Siguiente", tour_back:"Atrás", tour_done:"Entendido", dash_baseline_covered:"Base cubierta", dash_to_go:"Faltan {amt}", dash_no_income:"Aún sin ingresos este mes", dash_income_label:"Ingreso este mes", dash_baseline_label:"Base", dash_spending_title:"Dinero para disfrutar este mes", dash_spending_sub:"de la asignación de disfrute del mes pasado", dash_coverage:"Cobertura", dash_runway_sub:"meses de margen", dash_saved_invested:"Ahorrado e invertido", dash_saved_sub:"del ingreso neto, últimos 90 días", dash_net_ytd:"Ingreso neto del año", dash_net_ytd_sub:"después de la reserva de impuestos", dash_setaside_sub:"acumulado este año", dash_debt_label:"Deuda", dash_total_owing:"Total pendiente", dash_paid_down:"Pagado este año", dash_selfloan_label:"Préstamo propio", dash_owed_self:"Actualmente te debes a ti mismo", dash_repaid_year:"Devuelto este año", dash_momentum_sub:"Lo que tu excedente construyó cada mes", dash_leg_savings:"Ahorro e inversión", dash_leg_debt:"Pago de deuda", dash_recent_gigs:"Trabajos recientes", dash_no_gigs:"Aún no hay trabajos. Toca + para registrar el primero.", exp_invest:"Invertir", exp_cc:"Tarjeta de crédito", exp_other_debt:"Otra deuda", exp_no_activity:"Sin actividad ese mes", exp_all_years:"Revisa todos los años, todos los trabajos recibidos — no solo {year}", dash_in_account:"En {account}", det_date:"Fecha", det_type:"Tipo", det_cartage:"Transporte / propinas", det_surplus:"Excedente de este trabajo", det_selfloan_repaid:"Préstamo propio devuelto", det_edit_entry:"Editar esta entrada", det_remove_entry:"Eliminar esta entrada", det_type_freelance:"Freelance", det_type_employment:"Empleo", det_type_instruction:"Instrucción", det_type_other:"Otro", rep_your_reports:"Tus informes", rep_free_tools:"Herramientas gratuitas", rep_card_accountant_title:"Para tu contador", rep_card_accountant_sub:"Ingresos del negocio, impuestos, pensión, deducciones", rep_card_giglog_title:"Registro de trabajos", rep_card_giglog_sub:"Todas las entradas de ingreso del año fiscal", rep_card_snapshot_title:"Resumen de fin de año", rep_card_snapshot_sub:"Tu año financiero completo en revisión", rep_card_invest_title:"Seguimiento de inversión", rep_card_invest_sub:"Aportes por tipo de cuenta", rep_card_audit_title:"Auditoría de transferencia a cuenta de separada", rep_card_audit_sub:"Revisa cada trabajo contra la fórmula correcta", rep_card_invoice_title:"Generador de facturas", rep_card_invoice_sub:"Crea una factura profesional en segundos", rep_tax_year:"Año fiscal", rep_total_entries:"Total de entradas", rep_total_gross:"Total bruto", rep_total_net_liquid:"Total neto líquido", rep_net_income:"Ingreso neto", rep_total_to:"Total a {account}", rep_enjoy_total:"Total de disfrute", rep_savings_total:"Total de ahorro", rep_invested_total:"Total invertido", rep_debt_paid:"Deuda pagada", rep_building_future:"% de construcción de futuro", rep_total_invested_auto:"Total invertido (remanente automático)", rep_bucket_ytd:"{name} del año", rep_no_gigs_logged:"Aún no hay trabajos registrados", rep_acct_freelance_note:"Solo ingresos freelance y otros — se excluye empleo T4", rep_col_gross:"Bruto", rep_col_hst:"HST", rep_col_dues:"Cuotas", rep_col_taxset:"Reserva", rep_no_freelance:"No se encontró ingreso freelance para {year}", rep_totals:"Totales", inv_free_note_strong:"Gratis para todos.", inv_free_note_body:"Completa los datos a continuación y toca \"Vista previa de factura\" para ver tu factura terminada, luego guárdala como PDF desde el menú de impresión de tu navegador (Archivo → Imprimir → Guardar como PDF).", inv_your_details:"Tus datos", inv_your_name_label:"Tu nombre / nombre del negocio", inv_your_name_ph:"Tu nombre", inv_your_addr_label:"Tu dirección", inv_your_addr_ph:"Calle Principal 123, Ciudad, Provincia", inv_email_label:"Correo electrónico", inv_phone_label:"Teléfono (opcional)", inv_client_details:"Datos del cliente", inv_client_name_label:"Nombre del cliente / organización", inv_client_name_ph:"Nombre del cliente", inv_client_addr_label:"Dirección del cliente", inv_client_addr_ph:"Calle Principal 123, Ciudad, Provincia/Estado", inv_details_title:"Datos de la factura", inv_num_label:"Factura n.°", inv_num_ph:"FACT-001", inv_due_label:"Fecha de vencimiento", inv_line_items:"Conceptos", inv_add_line:"Añadir concepto", inv_line_desc_ph:"Descripción (ej. Tarifa por actuación)", inv_premium_label:"¿Aplicar recargo/markup?", inv_premium_no:"Sin recargo", inv_premium_yes:"Sí — añadir un porcentaje", inv_premium_pct_label:"% de recargo", inv_tax_label:"¿Incluir impuesto sobre ventas?", inv_tax_no:"No — exento o no registrado", inv_tax_yes:"Sí — incluir impuesto sobre ventas", inv_tax_rate_label:"Tasa de impuesto %", inv_tax_reg_label:"Número de registro fiscal", inv_tax_reg_ph:"123456789 RT0001", inv_payment_label:"Instrucciones de pago", inv_payment_ph:"Transferencia a tu@correo.com dentro de 30 días", inv_preview_btn:"Vista previa de factura", inv_preview_label:"Vista previa", inv_save_pdf_note:"Para guardar como PDF: toca el botón de compartir/imprimir de tu navegador y elige \"Guardar como PDF\" o \"Imprimir a PDF\".", inv_title:"Factura", inv_num_prefix:"N.° {num}", inv_date_prefix:"Fecha: {date}", inv_due_prefix:"Vence: {date}", inv_from:"De", inv_billto:"Facturar a", inv_col_amt:"Monto", inv_subtotal:"Subtotal", inv_premium_row:"Recargo ({pct}%)", inv_taxrow:"Impuesto sobre ventas ({pct}%)", inv_tax_reg_suffix:" — Reg. n.° {reg}", inv_total:"Total", inv_payment_prefix:"Pago:", settings_page_title:"Ajustes", set_h_display:"Pantalla", set_learning_mode:"Modo de aprendizaje", set_learning_desc:"Muestra explicaciones útiles en toda la app. Desactívalo cuando ya conozcas el sistema.", set_h_accounts:"Tus cuentas", set_accounts_note:"Opcional — solo como referencia. Te ayuda a recordar qué cuenta es cuál cuando la app dice \"mueve a tu cuenta de separada.\"", set_chequing_label:"Cuenta corriente", set_chequing_ph:"ej. TD Chequing", set_setaside_label:"Cuenta de separada (ahorro de alto interés)", set_setaside_ph:"ej. EQ Bank HISA, Tangerine Savings", set_invest_label:"Cuenta de inversión", set_invest_ph:"ej. Wealthsimple RRSP, Questrade TFSA", set_h_monthly_costs:"Costos mensuales", set_total_baseline:"Base total", set_edit_costs:"Editar costos mensuales", set_h_tax:"Configuración de impuestos", set_currency_label:"Símbolo de moneda", set_taxsetaside_label:"Reserva de impuestos", set_salestax_rate_label:"Tasa de impuesto sobre ventas", set_edit_tax:"Editar configuración de impuestos", set_h_funfund:"Fondo de disfrute", set_carryover_label:"Acumular monto no gastado", set_carryover_desc:"Si está desactivado, tu fondo de disfrute se reinicia cada mes con la asignación del mes pasado.", set_h_buffer:"Mes de colchón", set_buffer_label:"Mantengo un mes de colchón", set_buffer_desc:"Este es solo un recordatorio para tu referencia — no cambia los cálculos. Si te pagas a ti mismo del ingreso del mes pasado el día 1, regístralo como un trabajo normal con esa fecha. La verificación de base funciona igual.", set_h_savings_goals:"Metas de ahorro", set_edit_savings:"Editar metas de ahorro", set_h_balances:"Saldos de cuentas", set_balances_desc:"Ingresa tus saldos actuales para calcular tus meses de cobertura (margen). Actualízalo cuando quieras.", set_checking_label:"Cuenta corriente ($)", set_savings_setaside_label:"Ahorros / cuenta de separada ($)", set_tfsa_label:"Ahorro libre de impuestos ($)", set_invest_accounts_label:"Cuentas de inversión ($)", set_h_debt:"Saldos de deuda", set_debt_desc:"Registra lo que debes para que el gráfico de progreso muestre tu avance en pagos.", set_cc_owing_label:"Total adeudado en tarjeta de crédito ($)", set_selfloan_desc:"Dinero que te has prestado a ti mismo — de tus ahorros o excedente de inversión, para devolverlo en tus propios términos. Se rastrea por separado porque te lo debes a ti mismo, no a un acreedor.", set_selfloan_add_label:"Añadir a préstamo propio adeudado ($)", set_add_amount:"Añadir este monto", set_exact_balances:"Establecer saldos exactos", set_h_data:"Tus datos", set_data_desc:"Exporta tus datos para tener una copia de seguridad o transferirlos a una futura versión de la app. Tus datos nunca salen de tu dispositivo a menos que los exportes.", set_export_btn:"Exportar mis datos (copia de seguridad)", set_import_btn:"Importar datos de una copia de seguridad", set_h_legal:"Legal", set_terms_btn:"Términos y descargo de responsabilidad", set_readiness_btn:"Guía de configuración de cuentas", set_copyright:"artisticAutonomy™ — © 2026 Alejandro Céspedes. Todos los derechos reservados.", set_h_advanced:"Ajustes avanzados", hm_invest_label:"Invertir", hm_invest_sub:"crece en {account} con el tiempo", tip_buffer_month:"Lleva un \"mes de colchón\" como referencia personal — si te pagaste con el ingreso del mes pasado el día 1, regístralo como un trabajo normal con esa fecha. Es un hábito, no un ajuste.", checkin_intro:"Unos minutos como CEO de tu propia vida — veamos cómo van las cosas.", checkin_step1_title:"Revisión de inversión", checkin_step1_body:"Has acumulado aproximadamente {amt} para invertir este trimestre. ¿Ya está en {account}, o todavía está en efectivo?", checkin_step1_yes:"Sí, ya está invertido", checkin_step1_no:"Todavía no — recuérdamelo después", checkin_step2_title:"Recibo de tu cuenta de separada", checkin_step2_body:"Ahora mismo deberías tener aproximadamente {total} en {account} — cerca de {gov} de eso es dinero del gobierno, el resto ({rest}) es ahorro y disfrute esperando su turno.", checkin_step2_gotit:"Entendido", checkin_step2_reminder:"Esta cuenta está pensada para tener solo dinero del gobierno y ahorros a corto plazo. Los intereses que genere normalmente también deberían moverse a tu cuenta de inversión, no quedarse aquí.", checkin_step3_title:"Prioridades de disfrute", checkin_step3_body:"¿En qué quieres que se use tu dinero de disfrute estos próximos meses?", checkin_tag_travel:"Viajes", checkin_tag_gear:"Equipo / instrumentos", checkin_tag_dining:"Salir a comer", checkin_tag_family:"Familia", checkin_tag_other:"Algo más", checkin_finish:"Terminar", checkin_tip:"Revisa cada pocos meses tu inversión, tu cuenta de separada, y en qué quieres que se use tu dinero de disfrute. Tócalo cuando quieras para hacerlo antes — el ciclo simplemente se reinicia.", invest_trend_up:"↑ {pct}% invertido — sube desde {prev}%", invest_trend_down:"↓ {pct}% invertido — baja desde {prev}%", invest_trend_flat:"{pct}% invertido — estable respecto al período anterior", invest_trend_tip:"Esto muestra cuánto de tu ingreso estás reservando para invertir — no cómo le está yendo a tu inversión en el mercado.", checkin_add_tag:"Añadir el tuyo", checkin_tag_placeholder:"ej. Lente de cámara", checkin_tag_add_btn:"Añadir", checkin_header_label:"Revisión trimestral", bkt_goal_label:"Meta (opcional)", bkt_goal_ph:"ej. 6000", rep_card_goals_title:"Progreso de metas", rep_card_goals_sub:"Qué tan cerca estás y cuándo lo lograrás", goals_none_set:"Aún no hay metas configuradas — añade un monto objetivo a cualquier meta de ahorro en Ajustes para ver tu progreso aquí.", goals_reached:"🎉 ¡Meta alcanzada!", goals_projected:"A tu ritmo reciente, la alcanzarás para {date}", goals_no_recent_pace:"Sin aportes recientes — ritmo desconocido", goals_alltime_note:"Progreso de todo el tiempo, sin importar el año seleccionado", goal_reached_announce:"🎉 ¡Meta alcanzada! Tu meta de {name} quedó completamente cubierta con este pago. Ese porcentaje ahora se redirige a inversión — un hábito más trabajando para tu futuro. Ajusta o crea una nueva meta cuando quieras en Ajustes.", goals_mark_spent:"Marcar como gastado, empezar de nuevo", exp_rent:"Alquiler / Hipoteca", exp_groceries:"Comida", exp_utilities:"Servicios", exp_transit:"Transporte / Auto", exp_childcare:"Cuidado infantil", exp_other:"Otros costos fijos", audit_col_stored:"Registrado", audit_col_correct:"Correcto", audit_col_diff:"Dif.", audit_total_short:"Total que te falta en {account}", audit_positive_note:"Una diferencia positiva significa que debería haberse movido más a {account} de lo que realmente se movió — completa tu cuenta real con el monto de ese trabajo. Toca un trabajo en la lista de Trabajos para editarlo y volver a guardarlo, lo que recalcula y corrige la cifra registrada aquí también.", audit_no_discrepancies:"No se encontraron discrepancias — cada trabajo recibido coincide con la fórmula correcta.", audit_historical_tag:"(histórico)", flag_debt_before_baseline:"Pago realizado antes de cubrir la base de este mes", dash_momentum_header:"Progreso", momentum_all:"Todo", momentum_sub_year:"Lo que tu excedente construyó cada mes", momentum_sub_all:"Tu progreso año por año", lifetime_saved_invested:"Total ahorrado e invertido", lifetime_debt_paid:"Total de deuda pagada", lifetime_since:"Desde que empezaste",
  inv_adjustments_title:"Ajustes de la factura", inv_adjustments_desc:"Recargos, impuesto sobre ventas, cuotas sindicales, descuentos — cualquier cosa que sume o reste al subtotal. Cada uno puede llevar una nota de referencia opcional (por ejemplo, un número de registro fiscal o de socio sindical) que se muestra entre paréntesis en la factura.", inv_add_adjustment:"Añadir ajuste", inv_hours_ph:"Horas", inv_rate_ph:"Tarifa/hora", inv_mode_flat:"Fijo", inv_mode_hourly:"Por hora", inv_amount_ph:"$ Monto", inv_adj_label_ph:"Etiqueta, ej. Doblaje, HST, Cuotas sindicales", inv_adj_refnote_ph:"Nota de referencia opcional, ej. 123456789 RT0001", inv_adj_type_flat:"$ fijo", inv_adj_dir_add:"+ Sumar", inv_adj_dir_subtract:"− Restar", inv_adj_empty_note:"Aún no hay ajustes. Úsalos para recargos, impuesto sobre ventas, cuotas sindicales o descuentos — cada uno se calcula a partir del subtotal.", inv_adjustment_default:"Ajuste",
  progress_card_title:"Tu progreso", progress_card_sub:"Tu puntaje de eficiencia de por vida, rachas y récords", progress_locked_caption:"Función premium", progress_locked_screen_msg1:"Esta es una función premium.", progress_locked_screen_msg2:"El acceso premium aún no está disponible para tu cuenta.", progress_eff_label:"Puntaje de eficiencia", progress_eff_caption:"Una mezcla de por vida de tu tasa de ahorro, pago de deudas, salud de tu préstamo propio y progreso de metas — distinto del número \"Ahorrado e invertido\" de tu pantalla de inicio, que solo mira los últimos 90 días.", progress_streaks_label:"Rachas", progress_streaks_empty:"Registra algunos trabajos para empezar a seguir tus rachas.", progress_baseline_paused:"Tu racha de base cubierta se pausó en {months} — eso es normal para el trabajo freelance. Si las cosas están lentas ahora mismo, ¿tendría sentido un trabajo temporal adicional para cubrir el bache?", progress_baseline_none_yet:"Aún no tienes una racha de base cubierta — eso es normal para el trabajo freelance. Cada trabajo que cubre la base empieza una.", progress_streak_in_a_row:"{months} seguidos", progress_invest_no_covered_yet:"Una vez que cubras la base en un mes, empezaremos a seguir aquí tu racha de inversión.", progress_invest_paused:"Racha de inversión pausada. ¡Vamos a reconstruirla!", progress_invest_label:"Algo invertido", progress_records_label:"Récords personales", progress_biggest_gig_label:"Trabajo más grande", progress_best_month_label:"Mejor mes", progress_longest_streak_label:"Racha de base más larga", progress_timetogoal_label:"Tiempo para tu meta", progress_no_goals_msg:"Aún no tienes metas de ahorro con un monto objetivo — añade una en Ajustes → Metas de ahorro.",
  inv_logo_title:"Logotipo (premium)", inv_logo_upload:"Subir logo", inv_logo_replace:"Reemplazar", inv_logo_remove:"Quitar", inv_logo_hint:"PNG o JPG, hasta 5MB. Se redimensiona automáticamente para mantener la app rápida.", inv_logo_bad_type:"Elige una imagen PNG o JPG.", inv_logo_too_large:"Ese archivo es demasiado grande — elige una imagen de menos de 5MB.",
  rep_excel_locked_note:"La exportación a Excel es una función premium.", rep_export_field:"Campo", rep_export_value:"Valor", rep_export_goal:"Meta", rep_export_saved:"Ahorrado", rep_export_target:"Objetivo", rep_export_status:"Estado",
  export_popup_blocked:"Tu navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio e inténtalo de nuevo.", export_lib_failed:"No se pudo cargar la herramienta de exportación a Excel. Revisa tu conexión e inténtalo de nuevo.",
  inv_export_btn:"Exportar / imprimir factura",
  export_default_name:"Mi Negocio", export_footer_invoice:"Preparado con artisticAutonomy™ | artisticautonomy.ca", export_footer_report:"Generado por artisticAutonomy™ | artisticautonomy.ca", progress_peak_efficiency:"🏆 ¡Eficiencia máxima! Estás sobresaliendo en todas las dimensiones.",
  auth_sub_line1:"Herramienta financiera para profesionales creativos.", auth_sub_login_line2:"Inicia sesión para continuar.", auth_sub_signup_line2:"Crea tu cuenta para empezar.", auth_login_btn:"Iniciar sesión", auth_signup_btn:"Crear cuenta", auth_toggle_to_signup:"¿No tienes cuenta? Regístrate", auth_toggle_to_login:"¿Ya tienes cuenta? Inicia sesión", auth_err_missing_fields:"Ingresa tu correo y contraseña.", auth_msg_check_email:"¡Cuenta creada! Revisa tu correo para confirmarla y luego inicia sesión.", auth_err_generic:"Algo salió mal. Inténtalo de nuevo.", set_h_account:"Cuenta", set_logged_in_as:"Sesión iniciada como", set_logout_btn:"Cerrar sesión",
  auth_forgot_link:"¿Olvidaste tu contraseña?", auth_back_to_login:"Volver a iniciar sesión", auth_reset_send_btn:"Enviar enlace de restablecimiento", auth_sub_reset_line2:"Ingresa tu correo para recibir un enlace de restablecimiento.", auth_set_new_password_btn:"Establecer nueva contraseña", auth_sub_setnew_line2:"Elige una nueva contraseña.", auth_new_password_ph:"Nueva contraseña", auth_err_missing_email:"Ingresa tu correo electrónico.", auth_err_missing_password:"Ingresa una nueva contraseña.", auth_msg_reset_sent:"Revisa tu correo para el enlace de restablecimiento.", auth_msg_password_updated:"¡Contraseña actualizada! Inicia sesión.", auth_password_field_label:"Contraseña", auth_confirm_password_ph:"Confirmar contraseña", auth_err_password_mismatch:"Las contraseñas no coinciden.", auth_resend_btn:"Reenviar correo de confirmación", auth_msg_resend_sent:"Correo de confirmación reenviado — revisa tu bandeja de entrada.", auth_existing_account_msg:"Este correo ya tiene una cuenta.", auth_existing_account_login_btn:"Iniciar sesión", auth_existing_account_reset_btn:"Restablecer contraseña", auth_resend_cooldown:"Podrás reenviar en {s}s", set_change_pw_title:"Cambiar contraseña", set_change_pw_btn:"Actualizar contraseña", set_pw_msg_updated:"¡Contraseña actualizada!"
},
fr:{
  lang_title:"Choisissez votre langue", lang_sub:"Vous pouvez la changer à tout moment dans les Paramètres.",
  lang_en:"English", lang_es:"Español", lang_fr:"Français", lang_confirm:"Continuer",
  nav_dashboard:"Tableau de bord", nav_gigs:"Contrats", nav_reports:"Rapports",
  onb1_title:"Votre base mensuelle", onb1_sub:"Ajoutez chaque dépense fixe — loyer, épicerie, services publics, garde d'enfants. C'est le montant auquel votre revenu est comparé chaque mois.",
  onb1_add_expense:"Ajouter une dépense", onb1_baseline_label:"Base mensuelle", onb1_continue:"Continuer", onb1_suggestion_note:"Les chiffres en gris sont des suggestions approximatives de départ — tapez votre montant réel pour les remplacer.", terms_title:"Conditions et avis de non-responsabilité", terms_p1:"artisticAutonomy™ est un outil propriétaire créé par Alejandro Céspedes. Le nom, la marque, le design et le code sous-jacent sont protégés par le droit d’auteur et une marque de commerce. Cette version bêta est partagée en privé à des fins de test uniquement et n’est pas autorisée pour la redistribution, la copie ou la réutilisation commerciale.", terms_p2_strong:"Ce n’est pas un conseil financier.", terms_p2:"Cette appli est un outil d’organisation et d’éducation. Elle ne fournit pas de conseils financiers, fiscaux, juridiques ou de placement. Les calculs sont basés sur les pourcentages et paramètres que vous entrez.", terms_professional_strong:"Quand consulter un vrai professionnel.", terms_professional_intro:"Cette appli vous aide à organiser et comprendre vos chiffres — elle ne remplace pas un conseil personnalisé. Consultez un comptable, un fiscaliste ou un conseiller financier qualifié quand :", terms_prof_1:"Vous vous inscrivez pour percevoir la taxe de vente (TVH/TPS/TVA) pour la première fois, ou n’êtes pas sûr de devoir le faire", terms_prof_2:"Vous recevez une facture d’impôt qui vous surprend, ou êtes en retard sur des paiements d’impôt", terms_prof_3:"Vous faites face à une dette au-delà de ce qu’un simple plan de paiement peut régler", terms_prof_4:"Vous recevez un paiement unique important ou une rentrée d’argent inattendue", terms_prof_5:"Vous êtes à quelques années de la retraite, ou planifiez un changement de vie majeur", terms_prof_6:"Votre situation implique plusieurs types de revenu, provinces/états ou pays", terms_p3_strong:"Vos données.", terms_p3:"Toutes les informations que vous entrez restent sur votre propre appareil, stockées localement dans votre navigateur. Cette appli ne les transmet ni ne les stocke jamais sur un serveur externe. Vous êtes responsable de sauvegarder vos données via la fonction d’exportation, car effacer les données de votre navigateur les supprimera.", terms_p4_strong:"Logiciel bêta.", terms_p4:"Cette appli est en développement actif. Les fonctionnalités, calculs et structures de données peuvent changer. Bien que des précautions soient prises pour garder vos données intactes entre les mises à jour, aucune garantie n’est donnée contre la perte de données — exportez des sauvegardes régulièrement.", terms_got_it:"Compris",
  onb2_title:"Paramètres fiscaux", onb2_sub:"Ces valeurs déterminent chaque calcul. Les valeurs par défaut sont pour l'Ontario — ajustez-les selon votre province ou pays.",
  onb2_currency_label:"Symbole monétaire", onb2_currency_other_label:"Votre symbole monétaire",
  onb2_tax_label:"% de réserve d'impôt (incluant les cotisations de retraite)", onb2_hst_label:"% de taxe de vente", onb2_dues_label:"% de cotisations syndicales",
  onb2_note:"Votre réserve d'impôt couvre l'impôt sur le revenu et les cotisations de retraite. En cas de doute, 32-35 % est un bon point de départ pour la plupart des pigistes — ajustez selon votre situation.",
  onb2_continue:"Continuer", onb2_back:"Retour",
  onb3_title:"Vos objectifs d'épargne", onb3_sub:"Nommez vos catégories d'épargne et attribuez un pourcentage du surplus de chaque contrat. Fonds de vacances, fonds d'urgence, nouvel instrument — ce qui compte pour vous.",
  onb3_note:"Ceci est votre surplus. Chaque dollar a une destination — profiter le mois prochain, épargner ou investir.",
  onb3_bucket_name_placeholder:"ex. Fonds de vacances", onb3_pct_left_prefix:"Restant à investir :",
  onb3_continue:"Continuer", onb3_back:"Retour",
  onb4_title:"Investissement", onb4_sub:"Ce qu'il reste après l'impôt, les cotisations, vos objectifs d'épargne et le montant plaisir va automatiquement à l'Investissement — sans avoir à le diviser ni le nommer. Ouvrez un compte de placement autogéré (REER, CELI, compte de courtage, ou l'équivalent chez vous) et assurez-vous que ce surplus soit réellement investi une fois qu'il y arrive.",
  onb4_enjoy_label:"% plaisir (du surplus restant)", onb4_start:"Commencer le suivi", onb4_back:"Retour",
  dash_this_month:"Ce mois-ci", dash_status_label:"Statut", settings_language:"Langue", settings_change_language:"Changer de langue", tip_gated_status:"Ceci indique si votre base de ce mois est déjà couverte — le surplus ne se répartit qu'une fois qu'elle l'est.", tip_setaside:"C'est le total cumulé qui devrait se trouver dans votre vrai compte de côté, pas seulement suivi ici.", tip_momentum:"Touchez une barre pour voir exactement où est allé le surplus de ce mois-là.", tip_historical:"Utilisez ceci pour les contrats déjà passés — entrez ce qui s'est réellement passé plutôt que de laisser l'appli calculer.", settings_tips_section:"Astuces", settings_replay_tips:"Revoir les astuces", settings_guided_tour:"Faire la visite guidée", gloss_page_title:"Glossaire", gloss_h_setaside:"Compte de côté", gloss_p_setaside:"Un compte d'épargne à intérêt élevé où votre réserve d'impôt, vos catégories d'épargne et votre allocation plaisir se déposent après chaque contrat, gagnant des intérêts en attendant. Au Canada, c'est un HISA (High-Interest Savings Account) ; aux États-Unis, un HYSA (High-Yield Savings Account). Si vous êtes ailleurs, cherchez l'équivalent chez votre banque : un compte d'épargne à haut rendement, un compte avec préavis, ou similaire. Le concept est le même partout : l'argent gagne des intérêts en attendant, plutôt que de rester inactif.", gloss_h_baseline:"Base", gloss_p_baseline:"Vos coûts fixes mensuels totaux — loyer, services publics, épicerie, assurance, tout ce qui sort chaque mois, que vous ayez travaillé ou non. C'est le montant auquel votre revenu est comparé. Une fois couvert, le surplus se débloque.", gloss_h_gated:"Surplus conditionnel", gloss_p_gated:"Le montant disponible à allouer à l'épargne et à l'investissement — mais seulement une fois la base entièrement couverte pour le mois. Cette condition protège vos coûts fixes avant que quoi que ce soit d'autre ne bouge.", gloss_h_salestax:"Taxe de vente", gloss_p_salestax:"Taxe perçue auprès des clients pour le compte du gouvernement, ajoutée à votre tarif. Au Canada, c'est la TVH ou la TPS. En Europe, c'est la TVA. En Amérique latine, l'IVA. En Australie, la GST. Le concept et la façon dont l'appli le gère sont identiques peu importe comment votre pays l'appelle. S'applique seulement si vous êtes inscrit pour la percevoir — vérifiez le seuil local.", gloss_h_workdues:"Cotisations syndicales", gloss_p_workdues:"Frais versés à une association professionnelle ou un syndicat, calculés en pourcentage de votre tarif de base. Au Canada, cela s'applique couramment aux membres de la FAM (syndicat des musiciens). Hors Canada, votre équivalent pourrait être le Musicians' Union (Royaume-Uni), l'ISMA, ou un autre organisme. Si vous n'appartenez à aucun syndicat ou association, désactivez ceci — cela n'affectera pas vos calculs.", gloss_h_enjoy:"Allocation plaisir", gloss_p_enjoy:"Un pourcentage délibéré de votre surplus réservé à des dépenses sans culpabilité. Il se dépose dans votre compte de côté en attendant, puis revient à l'épargne le 1er de chaque mois — prêt à réapprovisionner le compte chèques à mesure que vous le dépensez réellement. Le plaisir intentionnel fait partie d'un plan financier durable.", gloss_h_saved:"Épargné et investi", gloss_p_saved:"Le pourcentage de votre revenu net des 90 derniers jours qui est allé vers des catégories d'épargne ou l'investissement. Plus c'est élevé, plus une grande part de vos revenus travaille pour votre avenir plutôt que de simplement passer.", gloss_h_funfund:"Fonds plaisir", gloss_p_funfund:"Les allocations plaisir du mois dernier, libérées le 1er de ce mois comme votre plafond de dépenses. L'appli ne suit pas ce que vous en dépensez — c'est intentionnel. Tout montant non dépensé se reporte ou se réinitialise, selon votre paramètre.", gloss_h_selfloan:"Auto-prêt", gloss_p_selfloan:"Argent que vous avez emprunté à votre propre surplus — pas à un créancier, mais à votre épargne ou investissement futur. Suivi séparément parce que l'obligation est envers vous-même, pas envers un prêteur. Enregistrez-le lorsque vous redirigez du surplus pour un besoin immédiat, et remboursez-le grâce à de futurs contrats quand la situation le permet.", gloss_h_taxsetaside:"Réserve d'impôt", gloss_p_taxsetaside:"Le pourcentage que vous retenez de chaque contrat pour couvrir votre impôt sur le revenu et vos cotisations de retraite en fin d'année. Votre comptable peut confirmer le bon chiffre pour votre situation. En cas de doute : 32 % est un bon point de départ pour la plupart des pigistes canadiens ; 35 % est plus prudent si vous voulez éviter une surprise ; hors Canada, renseignez-vous sur votre taux d'imposition de travailleur autonome — il est presque toujours plus élevé que celui des salariés.", btn_back:"Retour", hiw_page_title:"Comment ça marche", hiw_h_core:"L'idée de base", hiw_p_core:"Chaque contrat que vous gagnez suit une séquence simple : d'abord les obligations envers le gouvernement, puis vos coûts de base, et seulement après que ceux-ci sont couverts, le reste est à vous pour l'allouer intentionnellement.", hiw_h1:"1. Impôt + cotisations → compte de côté immédiatement", hiw_p1:"Dès qu'un contrat est enregistré, la part du gouvernement est calculée et marquée pour votre compte d'épargne à intérêt élevé. Elle y gagne des intérêts jusqu'à échéance — et reste séparée pour que vous ne soyez jamais tenté de la dépenser.", hiw_h2:"2. La base est couverte en premier", hiw_p2:"Votre revenu net s'accumule mois après mois. Ce n'est qu'une fois votre base couverte que le surplus se débloque. Cela garantit que vos coûts fixes ne sont jamais à risque. Pour couvrir votre base plus rapidement, envisagez d'augmenter vos revenus — plus de contrats, des engagements mieux payés, ou une source de revenu complémentaire à votre travail créatif. Beaucoup de musiciens actifs financent leur art grâce à un travail parallèle qui ne le compromet pas — cela leur donne la marge financière pour faire plus de ce qu'ils aiment.", hiw_h3:"3. Le surplus se répartit intentionnellement", hiw_p3:"Le surplus se divise entre le plaisir, vos catégories d'épargne et l'investissement. Vous définissez les pourcentages et pouvez les modifier à tout moment dans les Paramètres. Important : même lorsque vous avez des paiements de dette, l'appli réserve toujours une part au plaisir et à l'investissement. C'est intentionnel — la discipline de faire avancer quelque chose à chaque paiement, aussi petit soit-il, est l'habitude qui bâtit la santé financière avec le temps. La dette se règle par le surplus, jamais en éliminant complètement l'épargne et l'investissement.", hiw_h_accounts:"Les comptes qui font fonctionner ce système", hiw_p_accounts_intro:"Vous n'avez pas besoin de tout ouvrir d'un coup — mais avoir trois comptes séparés rend ce système beaucoup plus clair en pratique.", hiw_h_chequing:"Compte chèques — votre compte de transactions", hiw_p_chequing:"Les dépenses courantes passent par ici. Gardez-y seulement ce dont vous avez besoin pour la semaine en cours. Tout le reste gagne plus d'intérêts ailleurs.", hiw_h_savings:"Épargne et votre compte de côté — vos deux comptes d'attente", hiw_p_savings:"Ils servent des objectifs différents. Votre compte d'épargne est là où votre base réside entre les contrats — il alimente le compte chèques à mesure que les factures arrivent. Votre compte de côté (un compte d'épargne à intérêt élevé, ou l'équivalent chez votre banque) est là où votre réserve d'impôt, vos catégories d'épargne et votre allocation plaisir se déposent après chaque contrat — gagnant des intérêts en attendant. Le 1er de chaque mois, votre allocation plaisir passe du compte de côté vers l'épargne, d'où elle réapprovisionne le compte chèques à mesure que vous dépensez pendant le mois. Un compte de côté à intérêt élevé rapporte considérablement plus qu'un compte d'épargne ordinaire — ça vaut la peine de changer si ce n'est pas déjà fait.", hiw_h_invest:"Compte de placement — votre compte d'avenir", hiw_p_invest:"Là où la part investissement va et reste. Important : ouvrir le compte est la première étape, mais l'argent doit réellement être investi une fois qu'il y arrive — placé dans un fonds indiciel, un FNB, ou un autre véhicule. Un compte dont l'argent reste en liquidités n'est pas de l'investissement. C'est un processus en deux étapes que beaucoup de gens manquent. Ce dans quoi vous investissez est votre décision — faites vos propres recherches et parlez à un professionnel de ce qui convient à votre situation particulière. Cette appli ne donne pas de conseils en placement.", hiw_h_percentages:"Définir vos pourcentages", hiw_p_percentages_intro:"Vous ne savez pas quels pourcentages utiliser pour vos catégories d'épargne ? Voici un cadre pratique pour commencer.", hiw_h_math:"Le calcul est simple", hiw_p_math:"Objectif annuel ÷ revenu annuel de pigiste = pourcentage par contrat. Si vous gagnez environ 30 000 $ comme pigiste et voulez mettre de côté 6 000 $ pour des vacances, cela fait 6 000 $ ÷ 30 000 $ = 20 %. Réglez votre catégorie vacances à 20 % et chaque contrat déplacera automatiquement 20 % de son surplus vers cet objectif.", hiw_h_example:"Exemple — pigiste canadien", hiw_p_example:"Revenu annuel : 30 000 $. Objectif vacances : 6 000 $ → 20 %. Objectif de cotisation CELI : 7 000 $ → 24 %. Réserve d'impôt : 35 % (couvre l'impôt sur le revenu + les cotisations de retraite). Après l'impôt, les vacances et le CELI, environ 50-55 % de chaque surplus va à l'investissement ou au remboursement de dette — un pourcentage sain de bâtisseur d'avenir. Ajustez selon vos objectifs réels et vos obligations fiscales locales. Votre comptable peut confirmer le bon taux d'imposition pour votre situation.", hiw_h_gated_reminder:"Rappel sur le surplus conditionnel", hiw_p_gated_reminder:"Ces pourcentages s'appliquent seulement à votre surplus — ce qui reste une fois votre base mensuelle couverte. Si un contrat ne suffit pas à couvrir la base, rien ne se répartit encore. Le contrat entier sert d'abord à couvrir la base, et la répartition s'ouvre au prochain contrat qui vous fait dépasser ce seuil.", hiw_h_enjoy_flow:"Le parcours de votre argent plaisir", hiw_h_where:"Où cela va et quand", hiw_p_where:"L'allocation plaisir de chaque contrat se dépose dans votre compte de côté avec l'argent des impôts — elle gagne des intérêts en attendant. Le 1er de chaque mois, transférez ce montant vers votre compte d'épargne. Puis réapprovisionnez le compte chèques depuis l'épargne à mesure que vous le dépensez réellement pendant le mois. L'appli affiche votre argent disponible à dépenser dans la bannière « Argent à dépenser ce mois-ci » du tableau de bord.", gig_hist_toggle_label:"Entrée historique", default_setaside_name:"votre compte de côté", default_invest_name:"votre compte de placement", default_chequing_name:"votre compte chèques", gig_edit_title:"Modifier le contrat", btn_save_changes:"Enregistrer les modifications", hm_tax_dues_note:"Impôt + cotisations : {amt} — reste dans le compte de côté jusqu’à ce que ce soit nécessaire", hm_gov_label:"Réserve d’impôt", hm_gov_sub:"reste dans le compte de côté jusqu’à la saison des impôts", hm_savings_label:"Objectifs d’épargne", hm_savings_sub:"y reste jusqu’à ce que vous en ayez besoin", hm_enjoy_label:"Allocation plaisir", hm_enjoy_sub:"revient à l’épargne le 1er", gig_title:"Enregistrer un contrat", gig_date:"Date", gig_date_err:"Ajoutez une date", gig_status:"Statut", gig_status_received:"Reçu", gig_status_pending:"En attente", hist_note:"Entrez ce qui s'est réellement passé plutôt que de laisser l'appli calculer", hist_what_happened:"Ce qui s'est réellement passé", hist_scale_fee:"Tarif de base ($)", hist_cartage:"Transport / pourboires ($)", hist_tax:"Réserve d'impôt ($)", hist_hst:"Taxe de vente ($)", hist_dues:"Cotisations syndicales ($)", hist_net:"Net liquide ($)", hist_enjoy:"Plaisir mois prochain ($)", hist_invest:"Investi ($)", hist_cc:"Carte de crédit payée ($)", hist_loan:"Autre dette payée ($)", hist_sl_borrow:"Auto-prêt emprunté ($)", hist_sl_repay:"Auto-prêt remboursé ($)", hist_income_type:"Type de revenu", hist_type_freelance:"Autonome / Pigiste", hist_type_employment:"Emploi (T4 — impôt à la source)", hist_type_other:"Autre", hist_notes:"Notes", hist_notes_ph:"ex. T4, TVH non perçue, paiement comptant...", hist_transfer_header:"Transfert au compte de côté (impôt + cotisations)", gig_desc:"Description", gig_desc_ph:"ex. Concert, répétition, spectacle, événement", gig_desc_err:"Ajoutez une description", gig_payer:"Payeur", gig_payer_ph:"Organisation ou personne", gig_payer_err:"Ajoutez le payeur", gig_income_type:"Type de revenu", gig_type_freelance:"Autonome / pigiste", gig_type_employment:"Emploi (impôt retenu à la source)", gig_type_other:"Autre", check_helper_title:"Calculateur de chèque (optionnel)", check_amount_label:"Montant du chèque", check_calc_label:"Tarif de base calculé", check_helper_note:"Entrez le paiement reçu et le tarif de base sera estimé. Confirmez qu'il correspond à votre facture, puis il se remplit automatiquement ci-dessous.", gig_scale_fee:"Tarif de base", gig_scale_fee_err:"Ajoutez un tarif de base", gig_cartage:"Transport / pourboires ($)", apply_sales_tax:"Appliquer la taxe de vente à ce contrat", apply_work_dues:"Appliquer les cotisations à ce contrat", debt_payments_title:"Paiements de dette pour ce contrat (optionnel)", debt_cc_label:"Carte de crédit ($)", debt_loan_label:"Autre dette ($)", debt_note:"Provient du surplus de ce contrat, le même argent qui irait sinon au plaisir, à l'épargne ou à l'investissement.", selfloan_title:"Auto-prêt (optionnel)", selfloan_borrow_label:"Emprunter à ce contrat ($)", selfloan_repay_label:"Vous remboursez ($)", selfloan_tip:"Argent que vous vous devez, distinct d'une dette envers un créancier. Emprunter provient du surplus de ce contrat — argent déjà destiné à l'épargne ou à l'investissement. «Vous remboursez» réduit ce que vous vous devez, tout comme un paiement de dette réduit ce que vous devez à un créancier.", gig_notes:"Notes (optionnel)", gig_notes_ph:"Toute note sur ce contrat", split_where:"Où cela va", gig_hisa_tip:"Réserve d'impôt + cotisations de retraite. Déposez ceci dans votre compte d'épargne à intérêt élevé — cela rapporte des intérêts jusqu'à échéance et reste séparé pour éviter la tentation de le dépenser.", btn_add_gig:"Ajouter le contrat", btn_cancel:"Annuler", gig_logged_title:"Contrat enregistré", hm_tip:"Tout rapporte des intérêts en attendant. Voici ce qu'il contient :", hm_sub_logged:"«{name}» est enregistré.", hm_sub_historical:"«{name}» enregistré comme entrée historique.", hm_move_now:"Transférez à {account} maintenant", hm_transfer:"Transférer à {account}", split_income_tax:"Réserve d'impôt sur le revenu", split_sales_tax:"Taxe de vente perçue", split_work_dues:"Cotisations syndicales", split_net_liquid:"Net liquide", split_baseline_covered:"La base de ce mois est déjà couverte", split_toward_baseline:"Ce contrat contribue à votre base ({amt} encore nécessaire)", split_surplus:"Surplus de ce contrat : {amt}", split_selfloan_capped:"Emprunt limité au surplus disponible ({amt}) — vous ne pouvez pas emprunter plus que ce que ce contrat a généré", split_selfloan_repay_capped:"Remboursement limité au surplus restant — pas assez dans ce contrat pour rembourser ce montant", split_cc_capped:"Paiement de carte de crédit limité — pas assez de surplus dans ce contrat", split_loan_capped:"Paiement d'autre dette limité — pas assez de surplus dans ce contrat", split_selfloan_borrowed:"Auto-prêt emprunté", split_paying_back:"Remboursement à vous-même", split_cc_payment:"Paiement de carte de crédit", split_loan_payment:"Paiement d'autre dette", split_enjoy_next:"Plaisir mois prochain", split_invest_remainder:"Investissement (reste)", tour1_title:"Votre tableau de bord", tour1_body:"Voyez si la base de ce mois est couverte, suivez votre progression et sachez exactement combien se trouve dans votre compte de côté.", tour2_title:"Enregistrez vos contrats", tour2_body:"Chaque paiement est enregistré ici. L'appli le répartit automatiquement — impôt, cotisations, épargne, investissement, plaisir — dès que vous l'enregistrez.", tour3_title:"Rapports et outils", tour3_body:"Générez un résumé prêt pour votre comptable, créez une facture, ou consultez votre suivi d'investissement — tout construit à partir des contrats enregistrés.", tour4_title:"Personnalisez-la", tour4_body:"Ajustez votre base, vos taux d'impôt et vos objectifs d'épargne à tout moment, nommez vos comptes réels, changez de langue, ou revoyez les astuces — tout est ici.", tour_next:"Suivant", tour_back:"Retour", tour_done:"Compris", dash_baseline_covered:"Base couverte", dash_to_go:"{amt} restant", dash_no_income:"Aucun revenu ce mois-ci encore", dash_income_label:"Revenu ce mois-ci", dash_baseline_label:"Base", dash_spending_title:"Argent à dépenser ce mois-ci", dash_spending_sub:"de l'allocation plaisir du mois dernier", dash_coverage:"Couverture", dash_runway_sub:"mois de marge", dash_saved_invested:"Épargné et investi", dash_saved_sub:"du revenu net, 90 derniers jours", dash_net_ytd:"Revenu net de l'année", dash_net_ytd_sub:"après réserve d'impôt", dash_setaside_sub:"accumulé cette année", dash_debt_label:"Dette", dash_total_owing:"Total dû", dash_paid_down:"Remboursé cette année", dash_selfloan_label:"Auto-prêt", dash_owed_self:"Actuellement dû à vous-même", dash_repaid_year:"Remboursé cette année", dash_momentum_sub:"Ce que votre surplus a bâti chaque mois", dash_leg_savings:"Épargne et investissement", dash_leg_debt:"Remboursement de dette", dash_recent_gigs:"Contrats récents", dash_no_gigs:"Pas encore de contrat. Touchez + pour enregistrer le premier.", exp_invest:"Investissement", exp_cc:"Carte de crédit", exp_other_debt:"Autre dette", exp_no_activity:"Aucune activité ce mois-là", exp_all_years:"Vérifie toutes les années, tous les contrats reçus — pas seulement {year}", dash_in_account:"Dans {account}", det_date:"Date", det_type:"Type", det_cartage:"Transport / pourboires", det_surplus:"Surplus de ce contrat", det_selfloan_repaid:"Auto-prêt remboursé", det_edit_entry:"Modifier cette entrée", det_remove_entry:"Supprimer cette entrée", det_type_freelance:"Pigiste", det_type_employment:"Emploi", det_type_instruction:"Enseignement", det_type_other:"Autre", rep_your_reports:"Vos rapports", rep_free_tools:"Outils gratuits", rep_card_accountant_title:"Pour votre comptable", rep_card_accountant_sub:"Revenus d'entreprise, impôt, retraite, déductions", rep_card_giglog_title:"Registre des contrats", rep_card_giglog_sub:"Toutes les entrées de revenu de l'année fiscale", rep_card_snapshot_title:"Bilan de fin d'année", rep_card_snapshot_sub:"Votre année financière complète en revue", rep_card_invest_title:"Suivi des investissements", rep_card_invest_sub:"Cotisations par type de compte", rep_card_audit_title:"Vérification des transferts au compte de côté", rep_card_audit_sub:"Vérifie chaque contrat selon la bonne formule", rep_card_invoice_title:"Générateur de factures", rep_card_invoice_sub:"Créez une facture professionnelle en quelques secondes", rep_tax_year:"Année fiscale", rep_total_entries:"Total des entrées", rep_total_gross:"Total brut", rep_total_net_liquid:"Total net liquide", rep_net_income:"Revenu net", rep_total_to:"Total à {account}", rep_enjoy_total:"Total plaisir", rep_savings_total:"Total épargne", rep_invested_total:"Total investi", rep_debt_paid:"Dette remboursée", rep_building_future:"% bâtisseur d'avenir", rep_total_invested_auto:"Total investi (reste automatique)", rep_bucket_ytd:"{name} de l'année", rep_no_gigs_logged:"Pas encore de contrats enregistrés", rep_acct_freelance_note:"Revenus pigiste et autres seulement — emploi T4 exclu", rep_col_gross:"Brut", rep_col_hst:"TVH", rep_col_dues:"Cotis.", rep_col_taxset:"Impôt", rep_no_freelance:"Aucun revenu de pigiste trouvé pour {year}", rep_totals:"Totaux", inv_free_note_strong:"Gratuit pour tous.", inv_free_note_body:"Remplissez les détails ci-dessous et touchez « Aperçu de la facture » pour voir votre facture terminée, puis enregistrez-la en PDF depuis le menu d'impression de votre navigateur (Fichier → Imprimer → Enregistrer en PDF).", inv_your_details:"Vos coordonnées", inv_your_name_label:"Votre nom / nom d'entreprise", inv_your_name_ph:"Votre nom", inv_your_addr_label:"Votre adresse", inv_your_addr_ph:"123 rue Principale, Toronto, ON M5V 1A1", inv_email_label:"Courriel", inv_phone_label:"Téléphone (optionnel)", inv_client_details:"Coordonnées du client", inv_client_name_label:"Nom du client / organisation", inv_client_name_ph:"Nom du client", inv_client_addr_label:"Adresse du client", inv_client_addr_ph:"123 rue Principale, Ville, Province/État", inv_details_title:"Détails de la facture", inv_num_label:"Facture n°", inv_num_ph:"FACT-001", inv_due_label:"Date d'échéance", inv_line_items:"Articles", inv_add_line:"Ajouter un article", inv_line_desc_ph:"Description (ex. Cachet de performance)", inv_premium_label:"Appliquer une majoration?", inv_premium_no:"Aucune majoration", inv_premium_yes:"Oui — ajouter un pourcentage", inv_premium_pct_label:"% de majoration", inv_tax_label:"Inclure la taxe de vente?", inv_tax_no:"Non — exempté ou non inscrit", inv_tax_yes:"Oui — inclure la taxe de vente", inv_tax_rate_label:"Taux de taxe %", inv_tax_reg_label:"Numéro d'inscription fiscale", inv_tax_reg_ph:"123456789 RT0001", inv_payment_label:"Instructions de paiement", inv_payment_ph:"Virement Interac à vous@courriel.com dans les 30 jours", inv_preview_btn:"Aperçu de la facture", inv_preview_label:"Aperçu", inv_save_pdf_note:"Pour enregistrer en PDF : touchez le bouton de partage/impression de votre navigateur et choisissez « Enregistrer en PDF » ou « Imprimer en PDF ».", inv_title:"Facture", inv_num_prefix:"N° {num}", inv_date_prefix:"Date : {date}", inv_due_prefix:"Échéance : {date}", inv_from:"De", inv_billto:"Facturer à", inv_col_amt:"Montant", inv_subtotal:"Sous-total", inv_premium_row:"Majoration ({pct}%)", inv_taxrow:"Taxe de vente ({pct}%)", inv_tax_reg_suffix:" — N° d'inscription {reg}", inv_total:"Total", inv_payment_prefix:"Paiement :", settings_page_title:"Paramètres", set_h_display:"Affichage", set_learning_mode:"Mode d'apprentissage", set_learning_desc:"Affiche des explications utiles partout dans l'appli. Désactivez une fois le système maîtrisé.", set_h_accounts:"Vos comptes", set_accounts_note:"Optionnel — juste pour votre référence. Vous aide à vous souvenir de quel compte est lequel quand l'appli dit « transférez à votre compte de côté ».", set_chequing_label:"Compte chèques", set_chequing_ph:"ex. TD Chèques", set_setaside_label:"Compte de côté (épargne à intérêt élevé)", set_setaside_ph:"ex. EQ Bank HISA, Épargne Tangerine", set_invest_label:"Compte de placement", set_invest_ph:"ex. Wealthsimple REER, Questrade CELI", set_h_monthly_costs:"Coûts mensuels", set_total_baseline:"Base totale", set_edit_costs:"Modifier les coûts mensuels", set_h_tax:"Paramètres fiscaux", set_currency_label:"Symbole monétaire", set_taxsetaside_label:"Réserve d'impôt", set_salestax_rate_label:"Taux de taxe de vente", set_edit_tax:"Modifier les paramètres fiscaux", set_h_funfund:"Fonds plaisir", set_carryover_label:"Reporter le montant non dépensé", set_carryover_desc:"Si désactivé, votre fonds plaisir se réinitialise chaque mois avec l'allocation du mois dernier.", set_h_buffer:"Mois tampon", set_buffer_label:"Je maintiens un mois tampon", set_buffer_desc:"Ceci est juste un rappel pour votre référence — cela ne change pas les calculs. Si vous vous payez avec le revenu du mois dernier le 1er, enregistrez-le comme un contrat normal avec cette date. La vérification de base fonctionne de la même façon.", set_h_savings_goals:"Objectifs d'épargne", set_edit_savings:"Modifier les objectifs d'épargne", set_h_balances:"Soldes des comptes", set_balances_desc:"Entrez vos soldes actuels pour calculer vos mois de couverture (marge). Mettez à jour quand vous voulez.", set_checking_label:"Compte chèques ($)", set_savings_setaside_label:"Épargne / compte de côté ($)", set_tfsa_label:"Épargne libre d'impôt ($)", set_invest_accounts_label:"Comptes de placement ($)", set_h_debt:"Soldes de dette", set_debt_desc:"Suivez ce que vous devez pour que le graphique de progression montre vos remboursements.", set_cc_owing_label:"Total dû sur carte de crédit ($)", set_selfloan_desc:"Argent que vous vous êtes emprunté — de votre épargne ou surplus d'investissement, à rembourser selon vos propres termes. Suivi séparément parce que vous le devez à vous-même, pas à un créancier.", set_selfloan_add_label:"Ajouter à l'auto-prêt dû ($)", set_add_amount:"Ajouter ce montant", set_exact_balances:"Définir les soldes exacts", set_h_data:"Vos données", set_data_desc:"Exportez vos données pour garder une sauvegarde ou les transférer vers une future version de l'appli. Vos données ne quittent jamais votre appareil sauf si vous les exportez.", set_export_btn:"Exporter mes données (sauvegarde)", set_import_btn:"Importer des données depuis une sauvegarde", set_h_legal:"Légal", set_terms_btn:"Conditions et avis de non-responsabilité", set_readiness_btn:"Guide de configuration des comptes", set_copyright:"artisticAutonomy™ — © 2026 Alejandro Céspedes. Tous droits réservés.", set_h_advanced:"Paramètres avancés", hm_invest_label:"Investir", hm_invest_sub:"fructifie dans {account} avec le temps", tip_buffer_month:"Suivez un \u00ab mois tampon \u00bb pour votre propre référence — si vous vous êtes payé avec le revenu du mois dernier le 1er, enregistrez-le simplement comme un contrat normal à cette date. C\u2019est une habitude, pas un paramètre.", checkin_intro:"Quelques minutes en tant que PDG de votre propre vie — voyons où les choses en sont.", checkin_step1_title:"Vérification d'investissement", checkin_step1_body:"Vous avez accumulé environ {amt} à investir ce trimestre. Est-ce déjà dans {account}, ou est-ce encore en liquidités?", checkin_step1_yes:"Oui, c'est investi", checkin_step1_no:"Pas encore — rappelez-moi la prochaine fois", checkin_step2_title:"Reçu du compte de côté", checkin_step2_body:"Vous devriez actuellement avoir environ {total} dans {account} — environ {gov} de cela est de l'argent gouvernemental, le reste ({rest}) est de l'épargne et du plaisir qui attendent leur tour.", checkin_step2_gotit:"Compris", checkin_step2_reminder:"Ce compte est destiné à ne contenir que l’argent du gouvernement et de l’épargne à court terme. Les intérêts qu’il génère devraient généralement aussi être transférés vers votre compte de placement, pas rester ici.", checkin_step3_title:"Priorités plaisir", checkin_step3_body:"Vers quoi voulez-vous que votre argent plaisir aille ces prochains mois?", checkin_tag_travel:"Voyage", checkin_tag_gear:"Équipement / instruments", checkin_tag_dining:"Sorties au resto", checkin_tag_family:"Famille", checkin_tag_other:"Autre chose", checkin_finish:"Terminer", checkin_tip:"Faites le point tous les quelques mois sur votre investissement, votre compte de côté, et ce vers quoi vous voulez que votre argent plaisir aille. Touchez à tout moment pour le faire plus tôt — le cycle se réinitialise simplement.", invest_trend_up:"↑ {pct}% investi — en hausse depuis {prev}%", invest_trend_down:"↓ {pct}% investi — en baisse depuis {prev}%", invest_trend_flat:"{pct}% investi — stable par rapport à la période précédente", invest_trend_tip:"Cela montre quelle part de votre revenu vous mettez de côté pour investir — pas comment vos investissements performent sur le marché.", checkin_add_tag:"Ajouter le vôtre", checkin_tag_placeholder:"ex. Objectif photo", checkin_tag_add_btn:"Ajouter", checkin_header_label:"Bilan trimestriel", bkt_goal_label:"Objectif (optionnel)", bkt_goal_ph:"ex. 6000", rep_card_goals_title:"Progression des objectifs", rep_card_goals_sub:"À quel point vous en êtes, et quand vous y arriverez", goals_none_set:"Aucun objectif défini pour l'instant — ajoutez un montant cible à un objectif d'épargne dans les Paramètres pour voir votre progression ici.", goals_reached:"🎉 Objectif atteint!", goals_projected:"À votre rythme récent, atteint vers {date}", goals_no_recent_pace:"Aucune contribution récente — rythme inconnu", goals_alltime_note:"Progression depuis le début, peu importe l'année sélectionnée", goal_reached_announce:"🎉 Objectif atteint! Votre objectif {name} a été entièrement financé avec ce paiement. Ce pourcentage se redirige maintenant vers l’investissement — une habitude de plus qui travaille pour votre avenir. Ajustez ou créez un nouvel objectif à tout moment dans les Paramètres.", goals_mark_spent:"Marquer comme dépensé, recommencer", exp_rent:"Loyer / Hypothèque", exp_groceries:"Épicerie", exp_utilities:"Services publics", exp_transit:"Transport / Voiture", exp_childcare:"Garde d’enfants", exp_other:"Autres coûts fixes", audit_col_stored:"Enregistré", audit_col_correct:"Correct", audit_col_diff:"Diff.", audit_total_short:"Total manquant dans {account}", audit_positive_note:"Une différence positive signifie que davantage aurait dû être transféré à {account} que ce qui l’a réellement été — complétez votre vrai compte du montant de ce contrat. Touchez un contrat dans la liste des Contrats pour le modifier et l’enregistrer à nouveau, ce qui recalcule et corrige aussi le chiffre enregistré ici.", audit_no_discrepancies:"Aucun écart trouvé — chaque contrat reçu correspond à la formule correcte.", audit_historical_tag:"(historique)", flag_debt_before_baseline:"Paiement effectué avant que la base de ce mois soit couverte", dash_momentum_header:"Progression", momentum_all:"Tout", momentum_sub_year:"Ce que votre surplus a bâti chaque mois", momentum_sub_all:"Votre progression année par année", lifetime_saved_invested:"Total épargné et investi", lifetime_debt_paid:"Total de dette remboursée", lifetime_since:"Depuis vos débuts",
  inv_adjustments_title:"Ajustements de la facture", inv_adjustments_desc:"Majorations, taxe de vente, cotisations syndicales, rabais — tout ce qui s'ajoute ou se soustrait du sous-total. Chacun peut porter une note de référence optionnelle (par exemple un numéro d'inscription fiscale ou de membre syndical) affichée entre parenthèses sur la facture.", inv_add_adjustment:"Ajouter un ajustement", inv_hours_ph:"Heures", inv_rate_ph:"Taux/heure", inv_mode_flat:"Fixe", inv_mode_hourly:"Horaire", inv_amount_ph:"$ Montant", inv_adj_label_ph:"Étiquette, ex. Doublage, TVH, Cotisations syndicales", inv_adj_refnote_ph:"Note de référence optionnelle, ex. 123456789 RT0001", inv_adj_type_flat:"$ fixe", inv_adj_dir_add:"+ Ajouter", inv_adj_dir_subtract:"− Soustraire", inv_adj_empty_note:"Aucun ajustement pour l'instant. Utilisez-les pour les majorations, la taxe de vente, les cotisations syndicales ou les rabais — chacun est calculé à partir du sous-total.", inv_adjustment_default:"Ajustement",
  progress_card_title:"Votre progression", progress_card_sub:"Votre score d'efficacité à vie, vos séries et vos records", progress_locked_caption:"Fonctionnalité premium", progress_locked_screen_msg1:"Ceci est une fonctionnalité premium.", progress_locked_screen_msg2:"L'accès premium n'est pas encore disponible pour votre compte.", progress_eff_label:"Score d'efficacité", progress_eff_caption:"Un mélange à vie de votre taux d'épargne, de votre remboursement de dette, de la santé de votre auto-prêt et de votre progression vers vos objectifs — différent du chiffre « Épargné et investi » de votre tableau de bord, qui ne regarde que les 90 derniers jours.", progress_streaks_label:"Séries", progress_streaks_empty:"Enregistrez quelques contrats pour commencer à suivre vos séries.", progress_baseline_paused:"Votre série de base couverte s'est arrêtée à {months} — c'est normal pour le travail autonome. Si les choses sont calmes en ce moment, un petit contrat temporaire aurait-il du sens pour combler l'écart?", progress_baseline_none_yet:"Pas encore de série de base couverte — c'est normal pour le travail autonome. Chaque contrat qui couvre la base en commence une.", progress_streak_in_a_row:"{months} d'affilée", progress_invest_no_covered_yet:"Une fois que vous couvrez la base pour un mois, nous commencerons à suivre votre série d'investissement ici.", progress_invest_paused:"Série d'investissement interrompue. On la rebâtit!", progress_invest_label:"Investissement effectué", progress_records_label:"Records personnels", progress_biggest_gig_label:"Plus gros contrat", progress_best_month_label:"Meilleur mois", progress_longest_streak_label:"Plus longue série de base", progress_timetogoal_label:"Temps avant votre objectif", progress_no_goals_msg:"Aucun objectif d'épargne avec un montant cible pour l'instant — ajoutez-en un dans Paramètres → Objectifs d'épargne.",
  inv_logo_title:"Logo (fonction premium)", inv_logo_upload:"Téléverser un logo", inv_logo_replace:"Remplacer", inv_logo_remove:"Retirer", inv_logo_hint:"PNG ou JPG, jusqu'à 5 Mo. Redimensionné automatiquement pour garder l'appli rapide.", inv_logo_bad_type:"Veuillez choisir une image PNG ou JPG.", inv_logo_too_large:"Ce fichier est trop volumineux — veuillez choisir une image de moins de 5 Mo.",
  rep_excel_locked_note:"L'exportation Excel est une fonctionnalité premium.", rep_export_field:"Champ", rep_export_value:"Valeur", rep_export_goal:"Objectif", rep_export_saved:"Épargné", rep_export_target:"Montant cible", rep_export_status:"Statut",
  export_popup_blocked:"Votre navigateur a bloqué la fenêtre contextuelle. Autorisez les fenêtres contextuelles pour ce site et réessayez.", export_lib_failed:"Impossible de charger l'outil d'exportation Excel. Vérifiez votre connexion et réessayez.",
  inv_export_btn:"Exporter / imprimer la facture",
  export_default_name:"Mon Entreprise", export_footer_invoice:"Préparé avec artisticAutonomy™ | artisticautonomy.ca", export_footer_report:"Généré par artisticAutonomy™ | artisticautonomy.ca", progress_peak_efficiency:"🏆 Efficacité maximale ! Vous excellez sur tous les plans.",
  auth_sub_line1:"Outil financier pour les professionnels créatifs.", auth_sub_login_line2:"Connectez-vous pour continuer.", auth_sub_signup_line2:"Créez votre compte pour commencer.", auth_login_btn:"Se connecter", auth_signup_btn:"Créer un compte", auth_toggle_to_signup:"Pas de compte? Inscrivez-vous", auth_toggle_to_login:"Déjà un compte? Connectez-vous", auth_err_missing_fields:"Veuillez entrer votre courriel et votre mot de passe.", auth_msg_check_email:"Compte créé! Vérifiez votre courriel pour le confirmer, puis connectez-vous.", auth_err_generic:"Une erreur s'est produite. Veuillez réessayer.", set_h_account:"Compte", set_logged_in_as:"Connecté en tant que", set_logout_btn:"Se déconnecter",
  auth_forgot_link:"Mot de passe oublié?", auth_back_to_login:"Retour à la connexion", auth_reset_send_btn:"Envoyer le lien de réinitialisation", auth_sub_reset_line2:"Entrez votre courriel pour recevoir un lien de réinitialisation.", auth_set_new_password_btn:"Définir un nouveau mot de passe", auth_sub_setnew_line2:"Choisissez un nouveau mot de passe.", auth_new_password_ph:"Nouveau mot de passe", auth_err_missing_email:"Veuillez entrer votre courriel.", auth_err_missing_password:"Veuillez entrer un nouveau mot de passe.", auth_msg_reset_sent:"Vérifiez votre courriel pour le lien de réinitialisation.", auth_msg_password_updated:"Mot de passe mis à jour! Connectez-vous.", auth_password_field_label:"Mot de passe", auth_confirm_password_ph:"Confirmer le mot de passe", auth_err_password_mismatch:"Les mots de passe ne correspondent pas.", auth_resend_btn:"Renvoyer l'e-mail de confirmation", auth_msg_resend_sent:"E-mail de confirmation renvoyé — vérifiez votre boîte de réception.", auth_existing_account_msg:"Cet e-mail a déjà un compte.", auth_existing_account_login_btn:"Se connecter", auth_existing_account_reset_btn:"Réinitialiser le mot de passe", auth_resend_cooldown:"Renvoi disponible dans {s}s", set_change_pw_title:"Changer le mot de passe", set_change_pw_btn:"Mettre à jour le mot de passe", set_pw_msg_updated:"Mot de passe mis à jour!"
}
};
function t(key){
  const lang = S.lang || 'en';
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}
function detectLang(){
  const nav = (navigator.language||navigator.userLanguage||'en').toLowerCase();
  if(nav.startsWith('es')) return 'es';
  if(nav.startsWith('fr')) return 'fr';
  return 'en';
}
function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.documentElement.lang = S.lang || 'en';
}
function t2(lang,key){ return (I18N[lang]&&I18N[lang][key])||I18N.en[key]||key; }
let pendingLang='en';
function openLangPicker(onDone){
  pendingLang = detectLang();
  window._langPickerDone = onDone;
  renderLangOptions();
  openOv('lang-modal');
}
function closeLangIfVoluntary(e){
  if(e.target!==document.getElementById('lang-modal')) return;
  if(window._langPickerDone) return; // mandatory first-run pick — must confirm a language, not dismiss
  closeOv('lang-modal');
}
function selectLang(code){ pendingLang=code; renderLangOptions(); }
function renderLangOptions(){
  const opts=[['en','lang_en'],['es','lang_es'],['fr','lang_fr']];
  const el=document.getElementById('lang-options'); if(!el) return;
  el.innerHTML=opts.map(([code,key])=>{
    const active=pendingLang===code;
    return `<button onclick="selectLang('${code}')" style="text-align:left;padding:14px 16px;border-radius:var(--rs);border:1.5px solid ${active?'var(--sage)':'var(--border)'};background:${active?'var(--sage-l)':'var(--white)'};font-size:15px;font-weight:${active?'600':'500'};color:${active?'var(--sage-d)':'var(--text)'};cursor:pointer;display:flex;align-items:center;justify-content:space-between">${t2(pendingLang,key)}${active?'<i class="ti ti-check" style="color:var(--sage)" aria-hidden="true"></i>':''}</button>`;
  }).join('');
  const titleEl=document.getElementById('lang-modal-title'); if(titleEl) titleEl.textContent=t2(pendingLang,'lang_title');
  const subEl=document.getElementById('lang-modal-sub'); if(subEl) subEl.textContent=t2(pendingLang,'lang_sub');
  const btnEl=document.getElementById('lang-confirm-btn'); if(btnEl) btnEl.textContent=t2(pendingLang,'lang_confirm');
}
function confirmLang(){
  S.lang=pendingLang; S.hasSetLanguage=true; save();
  track('language_selected',{lang:pendingLang});
  closeOv('lang-modal');
  applyLang();
  try{ renderSettings(); }catch(e){}
  try{ updateDash(); }catch(e){}
  try{ renderGigs(); }catch(e){}
  const done=window._langPickerDone; window._langPickerDone=null;
  if(done) done();
}

// ===== PROGRESSIVE DISCLOSURE TIPS =====
const TIPS=[
  {id:'gated_status', anchor:'tip-anchor-status', key:'tip_gated_status', insertAfter:'this-month-card'},
  {id:'setaside', anchor:'tip-anchor-setaside', key:'tip_setaside', insertAfter:'grid2-financials'},
  {id:'momentum', anchor:'tip-anchor-momentum', key:'tip_momentum', insertAfter:'chart-wrap-momentum'},
  {id:'historical', anchor:'tip-anchor-historical', key:'tip_historical', insertAfter:'historical-toggle-row'},
  {id:'buffer', anchor:'tip-anchor-buffer', key:'tip_buffer_month', insertAfter:'this-month-card'},
  {id:'checkin', anchor:'checkin-tip-anchor', key:'checkin_tip', insertAfter:'tip-slot-header'},
  {id:'investtrend', anchor:'tip-anchor-investtrend', key:'invest_trend_tip', insertAfter:'grid2-coverage'}
];
function ensureTipMarkers(){
  TIPS.forEach(tip=>{
    const anchor=document.getElementById(tip.anchor);
    if(!anchor || document.getElementById('tipmarker-'+tip.id)) return;
    const btn=document.createElement('button');
    btn.className='tip-marker'; btn.id='tipmarker-'+tip.id;
    btn.textContent='?'; btn.setAttribute('aria-label','Help');
    btn.onclick=()=>showTip(tip.id,true);
    anchor.appendChild(btn);
  });
}
function checkAutoTips(){
  if(S.learnMode!==false && !window._tipsReplayActive) return; // dormant while Learning Mode is on, unless a replay is in progress
  TIPS.forEach(tip=>{
    if(S.tipsSeen[tip.id]) return;
    const anchor=document.getElementById(tip.anchor);
    if(!anchor || anchor.offsetParent===null) return; // not currently visible
    S.tipsSeen[tip.id]=true; save();
    showTip(tip.id,false);
  });
}
function showTip(id,isReplay){
  const tip=TIPS.find(x=>x.id===id); if(!tip) return;
  const anchor=document.getElementById(tip.anchor); if(!anchor) return;
  const target=document.getElementById(tip.insertAfter||tip.anchor); if(!target) return;
  const existing=document.getElementById('tipbubble-'+id);
  if(existing) existing.remove();
  const bubble=document.createElement('div');
  bubble.className='tip-bubble'; bubble.id='tipbubble-'+id;
  bubble.innerHTML='<span>'+t(tip.key)+'</span><button aria-label="Dismiss" onclick="dismissTip(\''+id+'\')">✕</button>';
  target.insertAdjacentElement('afterend',bubble);
  if(!S.tipsSeen[id]){ S.tipsSeen[id]=true; save(); }
}
function dismissTip(id){
  const bubble=document.getElementById('tipbubble-'+id);
  if(bubble) bubble.remove();
}
function replayAllTips(){
  document.querySelectorAll('.tip-bubble').forEach(b=>b.remove());
  S.tipsSeen={}; save();
  window._tipsReplayActive=true;
  TIPS.forEach(tip=>{
    const anchor=document.getElementById(tip.anchor);
    if(!anchor || anchor.offsetParent===null) return; // not currently visible on this page
    S.tipsSeen[tip.id]=true; save();
    showTip(tip.id,true);
  });
}

// ===== GUIDED TOUR =====
const TOUR_STEPS=[
  {icon:'ti-layout-dashboard', titleKey:'tour1_title', bodyKey:'tour1_body'},
  {icon:'ti-music', titleKey:'tour2_title', bodyKey:'tour2_body'},
  {icon:'ti-file-text', titleKey:'tour3_title', bodyKey:'tour3_body'},
  {icon:'ti-settings', titleKey:'tour4_title', bodyKey:'tour4_body'}
];
let tourStep=0;
function openTour(){
  tourStep=0;
  renderTourStep();
  openOv('tour-modal');
  track('tour_started');
}
// Dismissing via the backdrop is a distinct "skipped" signal from tourNext()'s "Done" completion
// below — separate from the generic closeOvIf() used by other modals so it doesn't fire there too.
function closeTourBackdrop(e){
  if(e.target !== document.getElementById('tour-modal')) return;
  track('tour_skipped',{step:tourStep});
  closeOv('tour-modal');
}
function renderTourStep(){
  const step=TOUR_STEPS[tourStep];
  document.getElementById('tour-icon').className='ti '+step.icon;
  document.getElementById('tour-title').textContent=t(step.titleKey);
  document.getElementById('tour-body').textContent=t(step.bodyKey);
  document.getElementById('tour-dots').innerHTML=TOUR_STEPS.map((_,i)=>
    `<span style="width:6px;height:6px;border-radius:50%;background:${i===tourStep?'var(--sage)':'var(--border)'}"></span>`).join('');
  document.getElementById('tour-back-btn').style.display=tourStep>0?'block':'none';
  document.getElementById('tour-back-btn').textContent=t('tour_back');
  document.getElementById('tour-next-btn').textContent=tourStep===TOUR_STEPS.length-1?t('tour_done'):t('tour_next');
}
function tourNext(){
  if(tourStep<TOUR_STEPS.length-1){ tourStep++; renderTourStep(); }
  else { closeOv('tour-modal'); track('tour_completed'); }
}
function tourPrev(){
  if(tourStep>0){ tourStep--; renderTourStep(); }
}

// ===== QUARTERLY CHECK-IN =====
function isCheckinDue(){
  if(S.investPendingConfirm) return true;
  if(!S.checkinAnchorDate) return false;
  const anchor=new Date(S.checkinAnchorDate+'T12:00:00');
  const due=new Date(anchor); due.setMonth(due.getMonth()+3);
  return new Date()>=due;
}
function updateCheckinDot(){
  const dot=document.getElementById('checkin-dot');
  if(dot) dot.style.display=isCheckinDue()?'block':'none';
}
function getSinceAnchorInvestTotal(){
  if(!S.checkinAnchorDate) return 0;
  const anchor=new Date(S.checkinAnchorDate+'T12:00:00');
  return S.gigs.filter(g=>g.status==='Received'&&new Date(g.date+'T12:00:00')>=anchor).reduce((t,g)=>t+(g.invest||0),0);
}
function getYtdSetAsideSplit(){
  const y=new Date().getFullYear();
  const ytd=S.gigs.filter(g=>g.status==='Received'&&new Date(g.date+'T12:00:00').getFullYear()===y);
  const total=ytd.reduce((t,g)=>t+(g.moveToHisa||0),0);
  const gov=ytd.reduce((t,g)=>t+(g.incomeTax||0)+(g.salesTax||0),0);
  return {total, gov, rest:Math.max(0,total-gov)};
}
function get90DayInvestPct(offsetDays){
  const end=new Date(); end.setDate(end.getDate()-offsetDays);
  const start=new Date(end); start.setDate(start.getDate()-90);
  const rec=S.gigs.filter(g=>{
    if(g.status!=='Received') return false;
    const gd=new Date(g.date+'T12:00:00');
    return gd>=start&&gd<end;
  });
  const netTotal=rec.reduce((t,g)=>t+g.netLiquid,0);
  const investTotal=rec.reduce((t,g)=>t+(g.invest||0),0);
  return netTotal>0?Math.round(investTotal/netTotal*100):0;
}
function updateInvestTrend(){
  const el=document.getElementById('tip-anchor-investtrend');
  const txt=document.getElementById('d-invest-trend-text');
  if(!el||!txt) return;
  const cur=get90DayInvestPct(0);
  const prev=get90DayInvestPct(90);
  if(cur===0&&prev===0){ el.style.display='none'; return; }
  el.style.display='block';
  let key,color;
  if(cur>prev){ key='invest_trend_up'; color='var(--sage)'; }
  else if(cur<prev){ key='invest_trend_down'; color='var(--gold-d)'; }
  else { key='invest_trend_flat'; color='var(--muted)'; }
  txt.textContent=t(key).replace('{pct}',cur).replace('{prev}',prev);
  txt.style.color=color;
}

let checkinStep=0;
const CHECKIN_TAGS=[
  {id:'travel',key:'checkin_tag_travel'},
  {id:'gear',key:'checkin_tag_gear'},
  {id:'dining',key:'checkin_tag_dining'},
  {id:'family',key:'checkin_tag_family'}
];
function openCheckin(){
  checkinStep=0;
  renderCheckinStep();
  openOv('checkin-modal');
  track('checkin_opened');
}
// Dismissing via the backdrop (not finishing the flow) is a distinct signal from checkin_completed
// below — separate from the generic closeOvIf() used by other modals so it doesn't fire there too.
function closeCheckinBackdrop(e){
  if(e.target !== document.getElementById('checkin-modal')) return;
  track('checkin_dismissed',{step:checkinStep});
  closeOv('checkin-modal');
}
function toggleMoneyDial(id){
  const i=S.moneyDialTags.indexOf(id);
  if(i>-1) S.moneyDialTags.splice(i,1);
  else S.moneyDialTags.push(id);
  save();
  renderCheckinStep();
}
function renderCheckinStep(){
  const body=document.getElementById('checkin-body');
  const dotsEl=document.getElementById('checkin-dots');
  const nextBtn=document.getElementById('checkin-next-btn');
  const backBtn=document.getElementById('checkin-back-btn');
  dotsEl.innerHTML=[0,1,2].map(i=>'<span style="width:6px;height:6px;border-radius:50%;background:'+(i===checkinStep?'var(--sage)':'var(--border)')+'"></span>').join('');
  backBtn.style.display=checkinStep>0?'block':'none';

  if(checkinStep===0){
    const amt=getSinceAnchorInvestTotal();
    body.innerHTML=
      '<div style="text-align:center;margin-bottom:16px">'+
      '<div style="width:52px;height:52px;background:var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><i class="ti ti-trending-up" style="color:white;font-size:24px" aria-hidden="true"></i></div>'+
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px">'+t('checkin_header_label')+'</div>'+
      '<p style="font-size:11px;color:var(--muted);font-style:italic;margin-bottom:8px">'+t('checkin_intro')+'</p>'+
      '<h2 style="font-size:18px;font-weight:700;color:var(--sage-d)">'+t('checkin_step1_title')+'</h2>'+
      '<p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5">'+t('checkin_step1_body').replace('{amt}',fmt(amt)).replace('{account}',getInvestName())+'</p>'+
      '</div>';
    nextBtn.textContent=t('checkin_step1_yes');
    nextBtn.onclick=()=>{ S.investPendingConfirm=false; save(); updateCheckinDot(); track('checkin_invest_confirm',{answer:'yes'}); checkinStep=1; renderCheckinStep(); };
    backBtn.onclick=null;
    // Secondary "not yet" choice
    body.innerHTML+='<button class="btn btn-g" style="margin-top:8px" onclick="S.investPendingConfirm=true;save();updateCheckinDot();track(\'checkin_invest_confirm\',{answer:\'not_yet\'});checkinStep=1;renderCheckinStep();">'+t('checkin_step1_no')+'</button>';
  } else if(checkinStep===1){
    const split=getYtdSetAsideSplit();
    body.innerHTML=
      '<div style="text-align:center;margin-bottom:16px">'+
      '<div style="width:52px;height:52px;background:var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><i class="ti ti-building-bank" style="color:white;font-size:24px" aria-hidden="true"></i></div>'+
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px">'+t('checkin_header_label')+'</div>'+
      '<h2 style="font-size:18px;font-weight:700;color:var(--sage-d)">'+t('checkin_step2_title')+'</h2>'+
      '<p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5">'+t('checkin_step2_body').replace('{total}',fmt(split.total)).replace('{account}',getSetAsideName()).replace('{gov}',fmt(split.gov)).replace('{rest}',fmt(split.rest))+'</p>'+
      '<p style="font-size:11px;color:var(--gold-d);margin-top:8px;line-height:1.5;font-style:italic">'+t('checkin_step2_reminder')+'</p>'+
      '</div>';
    nextBtn.textContent=t('checkin_step2_gotit');
    nextBtn.onclick=()=>{ checkinStep=2; renderCheckinStep(); };
  } else {
    const presetChips=CHECKIN_TAGS.map(tag=>{
      const sel=S.moneyDialTags.includes(tag.id);
      return '<button onclick="toggleMoneyDial(\''+tag.id+'\')" style="display:inline-flex;align-items:center;gap:6px;padding:7px 10px 7px 14px;margin:3px;border-radius:20px;border:1.5px solid '+(sel?'var(--sage)':'var(--border)')+';background:'+(sel?'var(--sage-l)':'none')+';color:'+(sel?'var(--sage-d)':'var(--muted)')+';font-size:13px;font-family:var(--font);cursor:pointer">'+t(tag.key)+
        (sel?'<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--sage-d);color:white"><i class="ti ti-x" style="font-size:10px" aria-hidden="true"></i></span>':'')+
        '</button>';
    }).join('');
    const customChips=S.customDialTags.map((label,i)=>
      '<span style="display:inline-flex;align-items:center;gap:6px;padding:7px 10px 7px 14px;margin:3px;border-radius:20px;border:1.5px solid var(--sage);background:var(--sage-l);color:var(--sage-d);font-size:13px">'+label+
      '<button onclick="removeCustomDialTag('+i+')" aria-label="Remove '+label+'" style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:var(--sage-d);color:white;border:none;cursor:pointer;padding:0"><i class="ti ti-x" style="font-size:10px" aria-hidden="true"></i></button>'+
      '</span>'
    ).join('');
    const addChip='<button onclick="showAddDialTagField()" id="add-dial-chip" style="display:inline-flex;align-items:center;gap:4px;padding:7px 12px;margin:3px;border-radius:20px;border:1.5px dashed var(--border);background:none;color:var(--muted);font-size:13px;font-family:var(--font);cursor:pointer"><i class="ti ti-plus" style="font-size:12px" aria-hidden="true"></i> '+t('checkin_add_tag')+'</button>';
    body.innerHTML=
      '<div style="text-align:center;margin-bottom:12px">'+
      '<div style="width:52px;height:52px;background:var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><i class="ti ti-sparkles" style="color:white;font-size:24px" aria-hidden="true"></i></div>'+
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px">'+t('checkin_header_label')+'</div>'+
      '<h2 style="font-size:18px;font-weight:700;color:var(--sage-d)">'+t('checkin_step3_title')+'</h2>'+
      '<p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5">'+t('checkin_step3_body')+'</p>'+
      '</div>'+
      '<div style="text-align:center;margin-bottom:4px">'+presetChips+customChips+addChip+'</div>'+
      '<div id="add-dial-field" style="display:none;margin-top:10px"><div style="display:flex;gap:6px"><input id="new-dial-tag" type="text" placeholder="'+t('checkin_tag_placeholder')+'" style="flex:1;padding:8px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font)" onkeydown="if(event.key===\'Enter\')addCustomDialTag()"><button class="btn-outline" style="padding:8px 14px" onclick="addCustomDialTag()">'+t('checkin_tag_add_btn')+'</button></div></div>';
    nextBtn.textContent=t('checkin_finish');
    nextBtn.onclick=finishCheckin;
  }
  backBtn.onclick=checkinPrev;
}
function showAddDialTagField(){
  document.getElementById('add-dial-field').style.display='block';
  document.getElementById('add-dial-chip').style.display='none';
  document.getElementById('new-dial-tag').focus();
}
function addCustomDialTag(){
  const input=document.getElementById('new-dial-tag');
  const val=input.value.trim();
  if(val){ S.customDialTags.push(val); save(); }
  renderCheckinStep();
}
function removeCustomDialTag(i){
  S.customDialTags.splice(i,1);
  save();
  renderCheckinStep();
}
function checkinNext(){ /* replaced dynamically per-step via renderCheckinStep */ }
function checkinPrev(){
  if(checkinStep>0){ checkinStep--; renderCheckinStep(); }
}
function finishCheckin(){
  S.checkinAnchorDate=new Date().toISOString().slice(0,10);
  save();
  updateCheckinDot();
  closeOv('checkin-modal');
  track('checkin_completed');
}

// ===== MOMENTUM CHART EXPAND =====
function renderMomentumChart(){
  const rec = S.gigs.filter(g=>g.status==='Received');
  const years = [...new Set(rec.map(g=>new Date(g.date+'T12:00:00').getFullYear()))].sort((a,b)=>b-a);
  const curYear = new Date().getFullYear();
  if(!years.includes(curYear)) years.unshift(curYear);
  const sel = document.getElementById('momentum-year-sel');
  const prevVal = sel.value || String(curYear);
  const isViewChange = sel.dataset.lastVal!==undefined && sel.dataset.lastVal!==prevVal;
  sel.innerHTML = '<option value="all">'+t('momentum_all')+'</option>' + years.map(y=>'<option value="'+y+'">'+y+'</option>').join('');
  sel.value = years.map(String).includes(prevVal) || prevVal==='all' ? prevVal : String(curYear);
  sel.dataset.lastVal = sel.value;
  if(isViewChange){ window._expandedMonth=null; const me=document.getElementById('month-expand'); if(me) me.style.display='none'; }
  const banner = document.getElementById('year-lifetime-banner');
  const sub = document.getElementById('momentum-sub');

  if(sel.value==='all'){
    sub.textContent = t('momentum_sub_all');
    const totalSaved = rec.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0);
    const totalDebt = rec.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0);
    banner.style.display='flex';
    banner.style.cssText='display:flex;justify-content:space-between;gap:10px;background:var(--sage-l);border-radius:var(--rs);padding:10px 12px;margin-bottom:10px';
    banner.innerHTML =
      '<div><div style="font-size:10px;color:var(--sage-d);text-transform:uppercase;letter-spacing:.5px">'+t('lifetime_saved_invested')+'</div><div style="font-size:16px;font-weight:700;color:var(--sage-d)">'+fmt(totalSaved)+'</div></div>'+
      '<div style="text-align:right"><div style="font-size:10px;color:var(--gold-d);text-transform:uppercase;letter-spacing:.5px">'+t('lifetime_debt_paid')+'</div><div style="font-size:16px;font-weight:700;color:var(--gold-d)">'+fmt(totalDebt)+'</div></div>';
    const yData = years.slice().reverse().map(yr=>{
      const yg = rec.filter(g=>new Date(g.date+'T12:00:00').getFullYear()===yr);
      return {
        l:String(yr), yr,
        b:yg.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0),
        d:yg.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0),
        invest:yg.reduce((t,g)=>t+(g.invest||0),0),
        cc:yg.reduce((t,g)=>t+(g.ccPay||0),0),
        other:yg.reduce((t,g)=>t+(g.loanPay||0),0),
        buckets:S.buckets.map(bk=>({name:bk.name,amt:yg.reduce((t,g)=>t+(g.buckets.find(x=>x.name===bk.name)||{amt:0}).amt,0)})).filter(x=>x.amt>0)
      };
    });
    window._momentumData=yData;
    window._momentumMode='year';
    const maxV=Math.max(...yData.map(d=>d.b+d.d),1);
    document.getElementById('mbars').innerHTML='<div style="display:flex;gap:14px;min-width:min-content">'+yData.map(d=>{
      const bH=Math.round(d.b/maxV*62);const dH=Math.round(d.d/maxV*62);
      return'<div class="bar-g" onclick="toggleMonthExpand(\''+d.yr+'\')" style="cursor:pointer;flex-shrink:0"><div class="bar-s">'+(d.d>0?'<div class="bar-seg" style="height:'+dH+'px;background:var(--gold)"></div>':'')+
        '<div class="bar-seg" style="height:'+Math.max(bH,3)+'px;background:'+(bH>2?'var(--sage)':'#e5e7eb')+'"></div></div><div class="bar-lbl">'+d.l+'</div></div>';
    }).join('')+'</div>';
  } else {
    sub.textContent = t('momentum_sub_year');
    banner.style.display='none';
    const y = parseInt(sel.value);
    const months=['J','F','M','A','M','J','J','A','S','O','N','D'];
    const mData=months.map((_,i)=>{
      const mg=rec.filter(g=>{const d=new Date(g.date+'T12:00:00');return d.getMonth()===i&&d.getFullYear()===y;});
      return{
        l:months[i], mi:i,
        b:mg.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0),
        d:mg.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0),
        invest:mg.reduce((t,g)=>t+(g.invest||0),0),
        cc:mg.reduce((t,g)=>t+(g.ccPay||0),0),
        other:mg.reduce((t,g)=>t+(g.loanPay||0),0),
        buckets:S.buckets.map(bk=>({name:bk.name,amt:mg.reduce((t,g)=>t+(g.buckets.find(x=>x.name===bk.name)||{amt:0}).amt,0)})).filter(x=>x.amt>0)
      };
    });
    window._momentumData=mData;
    window._momentumMode='month';
    const maxV=Math.max(...mData.map(d=>d.b+d.d),1);
    document.getElementById('mbars').innerHTML=mData.map(d=>{
      const bH=Math.round(d.b/maxV*62);const dH=Math.round(d.d/maxV*62);
      return'<div class="bar-g" onclick="toggleMonthExpand('+d.mi+')" style="cursor:pointer"><div class="bar-s">'+(d.d>0?'<div class="bar-seg" style="height:'+dH+'px;background:var(--gold)"></div>':'')+
        '<div class="bar-seg" style="height:'+Math.max(bH,3)+'px;background:'+(bH>2?'var(--sage)':'#e5e7eb')+'"></div></div><div class="bar-lbl">'+d.l+'</div></div>';
    }).join('');
  }
  if(window._expandedMonth!=null) renderMonthExpand(window._expandedMonth);
}
function toggleMonthExpand(id){
  if(window._expandedMonth===id){ window._expandedMonth=null; document.getElementById('month-expand').style.display='none'; return; }
  window._expandedMonth=id;
  renderMonthExpand(id);
}
function renderMonthExpand(id){
  const el=document.getElementById('month-expand');
  const mode=window._momentumMode||'month';
  const data=(window._momentumData||[]).find(d=>mode==='year'?d.yr===parseInt(id):d.mi===id);
  if(!el||!data) return;
  const rows=[];
  data.buckets.forEach(b=>rows.push([b.name,b.amt]));
  if(data.invest>0) rows.push([t('exp_invest'),data.invest]);
  if(data.cc>0) rows.push([t('exp_cc'),data.cc]);
  if(data.other>0) rows.push([t('exp_other_debt'),data.other]);
  el.style.display='block';
  el.innerHTML = rows.length
    ? '<div style="background:var(--sage-l);border-radius:var(--rs);padding:10px 12px;margin-top:10px">'+
        rows.map(([label,amt])=>'<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:var(--sage-d)"><span>'+label+'</span><span style="font-weight:600">'+fmt(amt)+'</span></div>').join('')+
      '</div>'
    : '<div style="font-size:12px;color:var(--muted);padding:8px 0;text-align:center">'+t('exp_no_activity')+'</div>';
}

// ===== AUTH (Supabase) =====
// Real per-user accounts via Supabase Auth, replacing the old single shared beta password.
// Scope for this round: sign up, log in, log out, forgot/reset password, and a basic
// "who's logged in" check. Deliberately NOT touched yet: syncing app data (S) to the account,
// premium/subscription logic, or the existing localStorage data model — those are later rounds.
const SUPABASE_URL = 'https://aghokgkruthzjnzmqktv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mndV4vdhLCXBY5vIkwsbSA_rWesGGyQ';
const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let authMode = 'login'; // 'login' | 'signup' | 'reset-request' | 'reset-confirm'

function getCurrentUser(){ return currentUser; }

// Single source of truth for boot-time auth state. Supabase fires this listener once
// immediately on subscription with whatever the current state already is (existing persisted
// session, a password-recovery link just landed on, or nothing) — deliberately NOT paired with
// a separate manual getSession() call on boot, since running both risked a race where a
// recovery link's session could be treated as a normal login before PASSWORD_RECOVERY was handled.
let authBootHandled = false;
sbClient.auth.onAuthStateChange(async (event, session) => {
  if(event === 'PASSWORD_RECOVERY'){
    authMode = 'reset-confirm';
    renderAuthMode();
    authBootHandled = true;
    return;
  }
  currentUser = session ? session.user : null;
  if(!authBootHandled){
    authBootHandled = true;
    if(session) await enterApp();
  }
});

// Real, per-account premium entitlement — replaces the old local devPremiumUnlocked toggle, which
// let any signed-up user grant themselves premium via Settings (a real gap once real accounts
// existed). premium_access lives in a separate `profiles` table, not on the auth user record, with
// Row Level Security allowing a user to SELECT only their own row and no INSERT/UPDATE/DELETE policy
// at all for regular users — so this can only ever be changed by Alejandro directly in the Supabase
// dashboard's Table Editor (which has elevated access that bypasses RLS), never from the browser.
let premiumAccess = false;
async function fetchPremiumAccess(){
  try{
    if(!currentUser) { premiumAccess = false; return; }
    const { data, error } = await sbClient.from('profiles').select('premium_access').eq('id', currentUser.id).single();
    if(error) throw error;
    premiumAccess = !!(data && data.premium_access);
  } catch(e){
    console.log('Premium access check failed — defaulting to locked:', e);
    premiumAccess = false; // fail closed: never default to unlocked just because the check errored
  }
}

async function enterApp(){
  document.getElementById('lock').style.display='none';
  document.getElementById('app-shell').style.display='flex';
  await fetchPremiumAccess(); // must resolve before load(), since dashboard rendering reads isPremiumUnlocked() immediately
  identifyAnalyticsUser();
  try{ load(); }catch(loadErr){ alert('Load error: '+loadErr.message); }
  try{ track('app_unlocked'); }catch(e){}
}

// Ties PostHog activity to the real signed-in account instead of just the anonymous per-device ID
// (see getAnonId()) — called from enterApp() so it covers every real way a session starts: login,
// signup with an instant session, a silently-restored session on normal app reopen, and auto-login
// right after a password reset. Uses the stable Supabase user id as the actual merge key, with email
// attached as a visible property, rather than using the email itself as the id — survives an email
// change later without fragmenting a person's event history, matching PostHog's own recommendation.
function identifyAnalyticsUser(){
  try{
    if(currentUser && window.posthog && typeof posthog.identify==='function'){
      posthog.identify(currentUser.id, { email: currentUser.email });
    }
  } catch(e){}
}

function startPasswordReset(){
  authMode = 'reset-request';
  renderAuthMode();
}
function toggleAuthMode(){
  if(authMode==='reset-confirm'){
    // Back out of an in-progress recovery session cleanly rather than leaving it dangling.
    sbClient.auth.signOut().catch(()=>{});
    authMode = 'login';
  } else if(authMode==='reset-request'){
    authMode = 'login';
  } else {
    authMode = authMode==='login' ? 'signup' : 'login';
  }
  renderAuthMode();
}
function renderAuthMode(){
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleBtn = document.getElementById('auth-toggle-btn');
  const forgotLink = document.getElementById('auth-forgot-link');
  const sub = document.getElementById('auth-sub');
  const emailField = document.getElementById('auth-email');
  const passField = document.getElementById('auth-password');
  const confirmField = document.getElementById('auth-password-confirm');
  const err = document.getElementById('auth-err'); if(err) err.style.display='none';
  const msg = document.getElementById('auth-msg'); if(msg) msg.style.display='none';
  const resendBtn = document.getElementById('auth-resend-btn'); if(resendBtn){ resendBtn.style.display='none'; clearResendCooldown(); resendBtn.disabled=false; }
  const existingHint = document.getElementById('auth-existing-hint'); if(existingHint) existingHint.style.display='none';

  emailField.style.display='block';
  passField.style.display='block';
  passField.placeholder = '••••••••';
  passField.setAttribute('aria-label', t('auth_password_field_label'));
  passField.setAttribute('autocomplete', 'current-password');
  confirmField.style.display='none';
  confirmField.value = '';
  forgotLink.style.display='none';
  toggleBtn.style.display='block';

  if(authMode==='signup'){
    submitBtn.textContent = t('auth_signup_btn');
    toggleBtn.textContent = t('auth_toggle_to_login');
    sub.innerHTML = t('auth_sub_line1')+'<br>'+t('auth_sub_signup_line2');
    // New account: "new-password" (not "current-password") is what tells password managers
    // like 1Password this is a create/generate field, not a login field to autofill from.
    passField.setAttribute('autocomplete', 'new-password');
    confirmField.style.display='block';
    confirmField.placeholder = t('auth_confirm_password_ph');
    confirmField.setAttribute('aria-label', t('auth_confirm_password_ph'));
    confirmField.setAttribute('autocomplete', 'new-password');
  } else if(authMode==='reset-request'){
    passField.style.display='none';
    submitBtn.textContent = t('auth_reset_send_btn');
    toggleBtn.textContent = t('auth_back_to_login');
    sub.innerHTML = t('auth_sub_line1')+'<br>'+t('auth_sub_reset_line2');
  } else if(authMode==='reset-confirm'){
    emailField.style.display='none';
    passField.placeholder = t('auth_new_password_ph');
    passField.setAttribute('aria-label', t('auth_new_password_ph'));
    passField.setAttribute('autocomplete', 'new-password');
    submitBtn.textContent = t('auth_set_new_password_btn');
    toggleBtn.style.display='none';
    sub.innerHTML = t('auth_sub_line1')+'<br>'+t('auth_sub_setnew_line2');
  } else { // login
    submitBtn.textContent = t('auth_login_btn');
    toggleBtn.textContent = t('auth_toggle_to_signup');
    forgotLink.style.display='block';
    sub.innerHTML = t('auth_sub_line1')+'<br>'+t('auth_sub_login_line2');
  }
}

async function handleAuthSubmit(){
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const err = document.getElementById('auth-err');
  const msg = document.getElementById('auth-msg');
  if(err) err.style.display='none';
  if(msg) msg.style.display='none';
  const submitBtn = document.getElementById('auth-submit-btn');

  if(authMode==='reset-request'){
    if(!email){ if(err){ err.textContent=t('auth_err_missing_email'); err.style.display='block'; } return; }
    if(submitBtn) submitBtn.disabled = true;
    try{
      const { error } = await sbClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname });
      if(error) throw error;
      if(msg){ msg.textContent = t('auth_msg_reset_sent'); msg.style.display='block'; }
      track('password_reset_requested');
    } catch(e){
      if(err){ err.textContent = e.message || t('auth_err_generic'); err.style.display='block'; }
      track('password_reset_request_error');
    } finally {
      if(submitBtn) submitBtn.disabled = false;
    }
    return;
  }

  if(authMode==='reset-confirm'){
    if(!password){ if(err){ err.textContent=t('auth_err_missing_password'); err.style.display='block'; } return; }
    if(submitBtn) submitBtn.disabled = true;
    try{
      const { error } = await sbClient.auth.updateUser({ password });
      if(error) throw error;
      track('password_reset_completed');
      const { data } = await sbClient.auth.getSession();
      if(data.session){
        currentUser = data.session.user;
        await enterApp();
      } else {
        authMode = 'login';
        renderAuthMode();
        if(msg){ msg.textContent = t('auth_msg_password_updated'); msg.style.display='block'; }
      }
    } catch(e){
      if(err){ err.textContent = e.message || t('auth_err_generic'); err.style.display='block'; }
      track('password_reset_error');
    } finally {
      if(submitBtn) submitBtn.disabled = false;
    }
    return;
  }

  if(!email || !password){
    if(err){ err.textContent = t('auth_err_missing_fields'); err.style.display='block'; }
    return;
  }
  if(authMode==='signup'){
    const confirmPassword = document.getElementById('auth-password-confirm').value;
    if(password !== confirmPassword){
      if(err){ err.textContent = t('auth_err_password_mismatch'); err.style.display='block'; }
      return;
    }
  }
  if(submitBtn) submitBtn.disabled = true;
  try{
    if(authMode==='signup'){
      track('signup_started');
      const { data, error } = await sbClient.auth.signUp({ email, password });
      if(error) throw error;
      if(data.session){
        currentUser = data.session.user;
        await enterApp();
      } else if(data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0){
        // Supabase's documented behavior: signUp() on an email that's already registered
        // returns a fake "success" (no session, no error, empty identities array) rather than
        // a real error — a deliberate anti-enumeration measure so signup can't be used to probe
        // which emails already have accounts. An empty identities array is our only reliable signal.
        authMode = 'login';
        renderAuthMode();
        showExistingAccountHint();
        track('signup_existing_account_detected');
      } else {
        // Project has "confirm email" on: account exists but isn't active until confirmed.
        // Switch back to login mode FIRST — renderAuthMode() clears any message as part of that
        // reset, so setting the "check your email" text has to happen after, not before.
        authMode = 'login';
        renderAuthMode();
        if(msg){ msg.textContent = t('auth_msg_check_email'); msg.style.display='block'; }
        showResendOption();
        track('signup_check_email_shown');
      }
    } else {
      track('login_started');
      const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
      if(error) throw error;
      currentUser = data.user;
      track('login_success');
      await enterApp();
    }
  } catch(e){
    if(err){ err.textContent = e.message || t('auth_err_generic'); err.style.display='block'; }
    track(authMode==='signup' ? 'signup_error' : 'login_error');
  } finally {
    if(submitBtn) submitBtn.disabled = false;
  }
}

let resendCooldownTimer = null;
function clearResendCooldown(){
  if(resendCooldownTimer){ clearInterval(resendCooldownTimer); resendCooldownTimer = null; }
}

function showResendOption(){
  const resendBtn = document.getElementById('auth-resend-btn');
  if(!resendBtn) return;
  clearResendCooldown();
  resendBtn.textContent = t('auth_resend_btn');
  resendBtn.disabled = false;
  resendBtn.style.display = 'block';
}

// 60s cooldown with a visible countdown — a slow computer or an impatient user clicking
// repeatedly would otherwise burn through Brevo's shared daily sending quota fast.
function startResendCooldown(seconds){
  const resendBtn = document.getElementById('auth-resend-btn');
  if(!resendBtn) return;
  clearResendCooldown();
  let remaining = seconds;
  resendBtn.disabled = true;
  resendBtn.textContent = t('auth_resend_cooldown').replace('{s}', remaining);
  resendCooldownTimer = setInterval(() => {
    remaining--;
    if(remaining <= 0){
      clearResendCooldown();
      resendBtn.disabled = false;
      resendBtn.textContent = t('auth_resend_btn');
    } else {
      resendBtn.textContent = t('auth_resend_cooldown').replace('{s}', remaining);
    }
  }, 1000);
}

async function resendConfirmationEmail(){
  const email = document.getElementById('auth-email').value.trim();
  const msg = document.getElementById('auth-msg');
  const err = document.getElementById('auth-err');
  if(!email) return;
  // Start the cooldown immediately, before the network call resolves — the point is to stop
  // rapid re-clicks at the source, regardless of whether this particular send succeeds.
  startResendCooldown(60);
  track('resend_confirmation_clicked');
  try{
    const { error } = await sbClient.auth.resend({ type: 'signup', email });
    if(error) throw error;
    if(err) err.style.display='none';
    if(msg){ msg.textContent = t('auth_msg_resend_sent'); msg.style.display='block'; }
  } catch(e){
    if(err){ err.textContent = e.message || t('auth_err_generic'); err.style.display='block'; }
  }
}

async function handleChangePassword(){
  const newPw = document.getElementById('set-new-password').value;
  const confirmPw = document.getElementById('set-confirm-password').value;
  const err = document.getElementById('set-pw-err');
  const msg = document.getElementById('set-pw-msg');
  if(err) err.style.display='none';
  if(msg) msg.style.display='none';
  if(!newPw){
    if(err){ err.textContent = t('auth_err_missing_password'); err.style.display='block'; }
    return;
  }
  if(newPw !== confirmPw){
    if(err){ err.textContent = t('auth_err_password_mismatch'); err.style.display='block'; }
    return;
  }
  try{
    const { error } = await sbClient.auth.updateUser({ password: newPw });
    if(error) throw error;
    document.getElementById('set-new-password').value = '';
    document.getElementById('set-confirm-password').value = '';
    if(msg){ msg.textContent = t('set_pw_msg_updated'); msg.style.display='block'; }
    track('password_changed');
  } catch(e){
    if(err){ err.textContent = e.message || t('auth_err_generic'); err.style.display='block'; }
  }
}

function showExistingAccountHint(){
  const hint = document.getElementById('auth-existing-hint');
  const hintText = document.getElementById('auth-existing-hint-text');
  const loginBtn = document.getElementById('auth-existing-login-btn');
  const resetBtn = document.getElementById('auth-existing-reset-btn');
  if(!hint) return;
  if(hintText) hintText.textContent = t('auth_existing_account_msg');
  if(loginBtn) loginBtn.textContent = t('auth_existing_account_login_btn');
  if(resetBtn) resetBtn.textContent = t('auth_existing_account_reset_btn');
  hint.style.display = 'block';
}

async function handleLogout(){
  track('logged_out'); // before signOut()/reload, so the event has a moment to actually be sent
  try{ await sbClient.auth.signOut(); }catch(e){ console.log('Logout error:', e); }
  currentUser = null;
  location.reload();
}
renderAuthMode();

// ===== PERSISTENCE =====
function checkFunFundReset(){
  const now=new Date(); const thisMonth=now.getMonth();
  if(S.funFund.lastResetMonth!==thisMonth){
    S.funFund.current=S.toggleCarry?(S.funFund.current||0)+(S.funFund.next||0):(S.funFund.next||0);
    S.funFund.next=0; S.funFund.lastResetMonth=thisMonth;
  }
}
function migrateOldData(){
  // Check for data saved under previous storage keys and migrate automatically
  var oldKeys=['aa_v4','aa_v3','aa_v2','aa2','aa3'];
  for(var i=0;i<oldKeys.length;i++){
    try{
      var old=localStorage.getItem(oldKeys[i]);
      if(old){
        var parsed=JSON.parse(old);
        // Generic merge: copies every field the old save has, regardless of what's been added
        // to S since then. Any new fields not present in the old save keep their fresh defaults.
        S=Object.assign({},S,parsed);
        // Save under new key and remove old
        localStorage.setItem('aa_v5',JSON.stringify(S));
        localStorage.removeItem(oldKeys[i]);
        console.log('Migrated data from',oldKeys[i]);
        return true;
      }
    }catch(e){ console.log('Migration error for',oldKeys[i],e); }
  }
  return false;
}

function load(){
  try{
    const d=localStorage.getItem('aa_v5');
    if(d){
      const saved=JSON.parse(d);
      S=Object.assign({},S,saved);
      if(!S.analytics)S.analytics={onboardingDropStep:null,sessionsCount:0,gigsLogged:0,screenVisits:{},learnModeChanges:0};
      if(!S.debt)S.debt={cc:0,loan:0};
      if(!S.balances)S.balances={checking:0,savings:0,tfsa:0,invest:0};
      if(!S.funFund)S.funFund={current:0,next:0,lastResetMonth:-1};
      if(typeof S.selfLoan!=='number')S.selfLoan=0;
      if(!S.currency)S.currency='$';
      // hasSeenReadinessCheck intentionally NOT defaulted — existing users should see it once
      // Backfill entryOrder for gigs logged before sort feature existed
      if(S.gigs && S.gigs.length){
        S.gigs.forEach((g,i)=>{
          if(!g.entryOrder) g.entryOrder = new Date(g.date+'T12:00:00').getTime() + i;
          if(typeof g.includeInAccountantReport!=='boolean') g.includeInAccountantReport = true;
        });
      }
    } else {
      // No v5 data found - check if there is older data to migrate
      migrateOldData();
    }
  }catch(e){console.log('Load error:',e);}
  appDataLoaded = true; // only from here on is S trustworthy to persist — see save()
  S.analytics.sessionsCount=(S.analytics.sessionsCount||0)+1;
  save();
  checkFunFundReset();
  applyLang();
  if(!S.hasSetLanguage){
    openLangPicker(continueBoot);
  } else {
    continueBoot();
  }
}
function localizeDefaultExpenses(){
  const defaults=[
    {id:1,en:'Rent / Mortgage',key:'exp_rent'},
    {id:2,en:'Groceries',key:'exp_groceries'},
    {id:3,en:'Utilities',key:'exp_utilities'},
    {id:4,en:'Transit / Car',key:'exp_transit'},
    {id:5,en:'Childcare',key:'exp_childcare'},
    {id:6,en:'Other fixed costs',key:'exp_other'}
  ];
  defaults.forEach(d=>{
    const exp=S.expenses.find(e=>e.id===d.id);
    if(exp&&exp.name===d.en) exp.name=t(d.key);
  });
}
function continueBoot(){
  if(S.onboarded){
    if(!S.checkinAnchorDate) S.checkinAnchorDate=new Date().toISOString().slice(0,10);
    document.getElementById('fab').style.display='flex';
    showPage('dashboard');
    applyLearnMode();
    try{ ensureTipMarkers(); checkAutoTips(); }catch(e){}
    updateCheckinDot();
    // Show readiness check once for all users (new and existing)
    if(!S.hasSeenReadinessCheck){
      setTimeout(()=>{ openOv('readiness-modal'); track('readiness_check_shown',{source:'auto'}); }, 800);
    }
  } else {
    localizeDefaultExpenses();
    try{ renderObExpRows(); }catch(e){ console.log('renderObExpRows error:',e); }
  }
}
// Guards against a real data-loss trap: save() must never write the bare, not-yet-loaded default S
// (onboarded:false, empty gigs, etc.) over a real user's persisted data. This can happen when
// anything calls save() — most notably track(), now that auth-screen events like login_error fire
// before load() has ever run for this session — while the user is still on the lock/auth screen,
// before enterApp() -> load() has actually read (or intentionally started fresh with) their data.
let appDataLoaded = false;
function save(){ if(!appDataLoaded) return; try{localStorage.setItem('aa_v5',JSON.stringify(S));}catch(e){} }

// ===== ANALYTICS (privacy-safe, local only) =====
function track(event,data){
  if(!S.analytics)S.analytics={};
  S.analytics.lastEvent=event;
  S.analytics.lastEventTime=new Date().toISOString();
  if(event==='screen_view'&&data){
    if(!S.analytics.screenVisits)S.analytics.screenVisits={};
    S.analytics.screenVisits[data]=(S.analytics.screenVisits[data]||0)+1;
  }
  if(event==='gig_logged')S.analytics.gigsLogged=(S.analytics.gigsLogged||0)+1;
  if(event==='learn_mode_changed')S.analytics.learnModeChanges=(S.analytics.learnModeChanges||0)+1;
  save();
  // PostHog — active when POSTHOG_KEY is set
  if(window.posthog && typeof posthog.capture === 'function') {
    try { posthog.capture(event, Object.assign({}, typeof data==='object'?data:{value:data}, {anon_id:getAnonId()})); } catch(e){}
  }
}
function getAnonId(){
  let id=localStorage.getItem('aa_anon_id');
  if(!id){id='anon_'+Math.random().toString(36).substr(2,9);localStorage.setItem('aa_anon_id',id);}
  return id;
}

// ===== HELPERS =====
function currSym(){ return S.currency || '$'; }
function fmt(n){ return currSym()+(+n||0).toLocaleString('en-CA',{minimumFractionDigits:0,maximumFractionDigits:0}); }
function fmt2(n){ return currSym()+(+n||0).toFixed(2); }
function fmtD(d){
  const locale = S.lang==='fr' ? 'fr-CA' : S.lang==='es' ? 'es-ES' : 'en-CA';
  return new Date(d+'T12:00:00').toLocaleDateString(locale,{month:'short',day:'numeric'});
}
function fmtFull(d){
  const locale = S.lang==='fr' ? 'fr-CA' : S.lang==='es' ? 'es-ES' : 'en-CA';
  return new Date(d+'T12:00:00').toLocaleDateString(locale,{year:'numeric',month:'long',day:'numeric'});
}

// ===== OVERLAY SYSTEM =====
function openOv(id){document.getElementById(id).classList.add('open');}
function closeOv(id){document.getElementById(id).classList.remove('open');}
function closeOvIf(e,id){if(e.target===document.getElementById(id))closeOv(id);}

// ===== DRAWER =====
function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('menu-btn').setAttribute('aria-expanded','true');}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('menu-btn').setAttribute('aria-expanded','false');}
function closeDrawerIf(e){if(e.target===document.getElementById('drawer'))closeDrawer();}

// ===== PAGE ROUTING =====
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  const nb=document.getElementById('nav-'+name);if(nb)nb.classList.add('active');
  track('screen_view',name);
  if(name==='dashboard')updateDash();
  if(name==='gigs'){
    const sel = document.getElementById('gig-sort');
    if(sel && S.lastGigSort) sel.value = S.lastGigSort;
    else if(sel) sel.value = 'newest';
    renderGigs();
  }
  if(name==='settings')renderSettings();
  if(name==='invoice')initInvoice();
  if(name==='reports')renderRepList();
  if(name==='progress')renderProgressScreen();
}

// ===== ONBOARDING =====
let obStep=1;
function goOb(n){
  document.querySelectorAll('.ob-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob'+n).classList.add('active');
  obStep=n;
  track('onboarding_step_viewed',{step:n});
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i<n));
  if(n===1)renderObExpRows();
  if(n===3){renderObBuckets();updateObPctLeft();}
  S.analytics.onboardingDropStep=n;save();
}
function obNext(){
  if(obStep===1) S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);
  if(obStep===2){
    S.settings.taxRate=(parseFloat(document.getElementById('t-tax').value)||32)/100;
    S.settings.hstRate=(parseFloat(document.getElementById('t-hst').value)||13)/100;
    S.settings.duesRate=(parseFloat(document.getElementById('t-dues').value)||3)/100;
    const cur = document.getElementById('t-currency')?.value || '$';
    S.currency = cur==='other' ? (document.getElementById('t-currency-other')?.value.trim()||'$') : cur;
  }
  if(obStep<4) goOb(obStep+1);
}
// Show/hide the "other" currency text field
document.addEventListener('DOMContentLoaded', function(){
  const sel = document.getElementById('t-currency');
  if(sel) sel.addEventListener('change', function(){
    const f = document.getElementById('t-currency-other-field');
    if(f) f.style.display = this.value==='other' ? 'block' : 'none';
  });
});
function obPrev(){if(obStep>1)goOb(obStep-1);}

// Expense rows
const OB_EXP_SUGGESTIONS={1:'1200',2:'400',3:'150',4:'200',5:'800',6:'100'};
function renderObExpRows(){
  const el=document.getElementById('ob-exp-rows');if(!el)return;
  el.innerHTML=S.expenses.map(e=>`
    <div class="exp-row">
      <input type="text" value="${e.name}" style="flex:1" onchange="updExpName(${e.id},this.value)" aria-label="Expense name">
      <input type="number" value="${e.amt||''}" placeholder="${OB_EXP_SUGGESTIONS[e.id]||'0'}" style="width:90px" onchange="updExpAmt(${e.id},this.value,'ob')" aria-label="Amount">
      <button class="exp-del" onclick="delExp(${e.id},'ob')" aria-label="Remove ${e.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`).join('');
  calcExpTotal('ob');
}
function updExpName(id,val){const e=S.expenses.find(x=>x.id===id);if(e)e.name=val;}
function updExpAmt(id,val,ctx){const e=S.expenses.find(x=>x.id===id);if(e){e.amt=parseFloat(val)||0;calcExpTotal(ctx);}}
function delExp(id,ctx){S.expenses=S.expenses.filter(x=>x.id!==id);if(ctx==='ob')renderObExpRows();else renderEditExpRows();}
function addObExp(){S.expenses.push({id:Date.now(),name:'',amt:0});renderObExpRows();}
function addEditExp(){S.expenses.push({id:Date.now(),name:'',amt:0});renderEditExpRows();}
function calcExpTotal(ctx){
  const t=S.expenses.reduce((s,e)=>s+e.amt,0);
  const el=document.getElementById(ctx==='ob'?'ob-total':'edit-exp-total');
  if(el)el.textContent=fmt(t);return t;
}

// Savings buckets
function usedPct(){return S.buckets.reduce((t,b)=>t+b.pct,0);}
function addObBucket(){
  const name=document.getElementById('ob-bn').value.trim();
  const pct=parseFloat(document.getElementById('ob-bp').value)||0;
  if(!name||pct<=0)return;
  if(usedPct()+pct>100){alert('Total would exceed 100%.');return;}
  S.buckets.push({id:Date.now(),name,pct});
  document.getElementById('ob-bn').value='';document.getElementById('ob-bp').value='';
  renderObBuckets();updateObPctLeft();
}
function removeBucket(id){S.buckets=S.buckets.filter(b=>b.id!==id);renderObBuckets();updateObPctLeft();renderEditBktList();}
function renderObBuckets(){
  const el=document.getElementById('ob-bkt-list');if(!el)return;
  el.innerHTML=S.buckets.map(b=>`<div class="bucket-item"><span class="bucket-name">${b.name}</span><span class="bucket-pct">${b.pct}%</span><button class="bucket-del" onclick="removeBucket(${b.id})" aria-label="Remove ${b.name}"><i class="ti ti-x" aria-hidden="true"></i></button></div>`).join('');
}
function updateObPctLeft(){
  const l=100-usedPct();
  const el=document.getElementById('ob-pct-left');
  if(el){el.innerHTML=`${t('onb3_pct_left_prefix')} <strong>${l}%</strong>`;el.className='pct-note'+(l<0?' pct-warn':'');}
}


function completeOb(){
  S.settings.enjoyPct=(parseFloat(document.getElementById('ob-enjoy')?.value)||20)/100;
  S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);
  S.onboarded=true;
  S.checkinAnchorDate=new Date().toISOString().slice(0,10);
  S.analytics.onboardingDropStep=null;
  track('onboarding_complete');
  save();
  document.getElementById('fab').style.display='flex';
  showPage('dashboard');
  // Show readiness check for new users after onboarding
  if(!S.hasSeenReadinessCheck){
    setTimeout(()=>{ openOv('readiness-modal'); track('readiness_check_shown',{source:'auto'}); }, 1000);
  }
}

// ===== GIG CALCULATIONS =====
// ===== CORE CALCULATION ENGINE (matches spreadsheet blueprint) =====
// Column mapping from spreadsheet:
// K=workDues (scale fee only), L=salesTax (scale fee only)  
// M=incomeTax (scale+cartage+tips), O=HISA=K+L+M
// P=netLiquid=netDeposit-HISA, U=gatedSurplus
// AA=moveToHISA=O+savingsBuckets (gov money + year-end savings parked in HISA)
function calcGig(fee, cart, type, applyHst, applyDues){
  const s = S.settings;
  let workDues = 0, salesTax = 0, incomeTax = 0;
  // Work dues: scale fee ONLY (not cartage/tips per design note)
  if(applyDues && type === 'Freelance') workDues = fee * s.duesRate;
  // Sales tax: scale fee ONLY (cartage/tips exempt per design note)
  if(applyHst && type === 'Freelance') salesTax = fee * s.hstRate;
  // Income tax: scale + cartage + tips for Freelance and Other (not Employment)
  if(type !== 'Employment') incomeTax = (fee + cart) * s.taxRate;
  const hisa = incomeTax + salesTax;
  const netDeposit = (fee + cart) + salesTax - workDues;
  const netLiquid = netDeposit - hisa;
  return { workDues, salesTax, incomeTax, hisa, netDeposit, netLiquid };
}

function getMonthNetLiquid(forDate, excludeId){
  const d = new Date(forDate + 'T12:00:00');
  return S.gigs.filter(g => {
    if(g.status !== 'Received') return false;
    if(excludeId && g.id === excludeId) return false;
    const gd = new Date(g.date + 'T12:00:00');
    return gd.getMonth()===d.getMonth() && gd.getFullYear()===d.getFullYear();
  }).reduce((t,g) => t + g.netLiquid, 0);
}

function calcSurplus(fee, cart, type, applyHst, applyDues, date, excludeId, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq){
  const c = calcGig(fee, cart, type, applyHst, applyDues);
  const monthNetSoFar = getMonthNetLiquid(date, excludeId);
  const baselineGap = Math.max(0, S.settings.baseline - monthNetSoFar);
  const gigSurplus = Math.max(0, c.netLiquid - baselineGap);
  // Self-loan borrow is capped at the gig surplus available — can't borrow more than what's actually free
  const selfLoanBorrow = Math.min(Math.max(0, selfLoanBorrowReq||0), gigSurplus);
  const selfLoanCapped = (selfLoanBorrowReq||0) > gigSurplus;
  const surplusAfterBorrow = gigSurplus - selfLoanBorrow;
  // Paying yourself back also comes out of this gig's surplus — same pocket as borrow, just a different destination
  const selfLoanRepay = Math.min(Math.max(0, selfLoanRepayReq||0), surplusAfterBorrow);
  const selfLoanRepayCapped = (selfLoanRepayReq||0) > surplusAfterBorrow;
  const surplusAfterSelfLoan = surplusAfterBorrow - selfLoanRepay;
  // Debt payments (credit card / other) also come out of this gig's surplus, same pocket
  const ccPay = Math.min(Math.max(0, ccPayReq||0), surplusAfterSelfLoan);
  const ccPayCapped = (ccPayReq||0) > surplusAfterSelfLoan;
  const surplusAfterCc = surplusAfterSelfLoan - ccPay;
  const loanPay = Math.min(Math.max(0, loanPayReq||0), surplusAfterCc);
  const loanPayCapped = (loanPayReq||0) > surplusAfterCc;
  const surplusAfterLoan = surplusAfterCc - loanPay;
  const enjoy = surplusAfterLoan * S.settings.enjoyPct;
  const bktAmts = S.buckets.map(b => ({name:b.name, pct:b.pct, amt: surplusAfterLoan * b.pct/100}));
  const totalBkts = bktAmts.reduce((t,b) => t + b.amt, 0);
  const invest = Math.max(0, surplusAfterLoan - enjoy - totalBkts);
  // Transfer to set-aside account = gov money + savings buckets + enjoy-life (enjoy parks here too, moves to savings on the 1st)
  const moveToHisa = c.hisa + totalBkts + enjoy;
  return {
    ...c, gigSurplus, baselineGap,
    baselineCovered: monthNetSoFar >= S.settings.baseline,
    selfLoanBorrow, selfLoanCapped, selfLoanRepay, selfLoanRepayCapped,
    ccPay, ccPayCapped, loanPay, loanPayCapped,
    enjoy, buckets: bktAmts, invest, moveToHisa
  };
}

function updateGigTypeDefaults(){
  const type = document.getElementById('g-type').value;
  if(type === 'Employment'){
    document.getElementById('g-hst').checked = false;
    document.getElementById('g-dues').checked = false;
  } else {
    document.getElementById('g-dues').checked = true;
  }
  calcGigModal();
  // Income type also feeds reverseCalcFee()'s formula (HST/dues multipliers only apply to Freelance) —
  // without this, a check-amount-derived fee goes stale when switching type after using that helper.
  reverseCalcFee();
}

function reverseCalcFee(){
  const checkAmt = parseFloat(document.getElementById('g-check-amt')?.value)||0;
  const cart = parseFloat(document.getElementById('g-cart')?.value)||0;
  const applyHst = document.getElementById('g-hst')?.checked||false;
  const applyDues = document.getElementById('g-dues')?.checked!==false;
  const type = document.getElementById('g-type')?.value||'Freelance';
  const resultEl = document.getElementById('g-check-result');
  if(!checkAmt){ if(resultEl) resultEl.textContent='—'; const feeEl0=document.getElementById('g-fee'); if(feeEl0 && feeEl0.dataset.autofilled==='1'){ feeEl0.value=''; feeEl0.dataset.autofilled=''; calcGigModal(); } return; }
  // Check = scale + cartage + HST(on scale) - dues(on scale)
  // Check - cartage = scale * (1 + hstRate - duesRate) for Freelance
  // Solve: scale = (check - cartage) / (1 + hstRate - duesRate)
  const s = S.settings;
  const hstMult = (applyHst && type==='Freelance') ? s.hstRate : 0;
  const duesMult = (applyDues && type==='Freelance') ? s.duesRate : 0;
  const divisor = 1 + hstMult - duesMult;
  const scaleFee = divisor > 0 ? (checkAmt - cart) / divisor : checkAmt - cart;
  if(resultEl) resultEl.textContent = scaleFee > 0 ? fmt2(scaleFee) : '—';
  // Auto-fill scale fee field
  const feeEl = document.getElementById('g-fee');
  if(feeEl && scaleFee > 0){
    feeEl.value = scaleFee.toFixed(2);
    feeEl.dataset.autofilled = '1';
    document.getElementById('f-fee')?.classList.remove('error');
    calcGigModal();
  }
}
function checkHistoricalToggle(){
  const dateEl = document.getElementById('g-date');
  const row = document.getElementById('historical-toggle-row');
  if(!dateEl || !row) return;
  const d = new Date(dateEl.value + 'T12:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const isPast = d < today;
  row.style.display = isPast ? 'block' : 'none';
  if(isPast){ ensureTipMarkers(); checkAutoTips(); }
  if(!isPast){
    document.getElementById('g-historical').checked = false;
    toggleHistoricalMode();
  }
}
function toggleHistoricalMode(){
  const on = document.getElementById('g-historical')?.checked;
  const hFields = document.getElementById('historical-fields');
  const mainFields = document.getElementById('main-gig-fields');
  const splitArea = document.getElementById('gig-split-area');
  if(hFields) hFields.style.display = on ? 'block' : 'none';
  if(mainFields) mainFields.style.display = on ? 'none' : 'block';
  if(splitArea && on) splitArea.style.display = 'none';
}
function calcHistoricalHisa(){
  const tax = parseFloat(document.getElementById('h-tax')?.value)||0;
  const hst = parseFloat(document.getElementById('h-hst')?.value)||0;
  const dues = parseFloat(document.getElementById('h-dues')?.value)||0;
  const total = tax + hst + dues;
  const preview = document.getElementById('h-hisa-preview');
  const amt = document.getElementById('h-hisa-amt');
  if(preview) preview.style.display = total > 0 ? 'block' : 'none';
  if(amt) amt.textContent = fmt2(total);
}
function calcGigModal(){
  const fee = parseFloat(document.getElementById('g-fee').value)||0;
  const cart = parseFloat(document.getElementById('g-cart').value)||0;
  if(!fee && !cart){ document.getElementById('gig-split-area').style.display='none'; return; }
  const type = document.getElementById('g-type').value;
  const applyHst = document.getElementById('g-hst')?.checked || false;
  const applyDues = document.getElementById('g-dues')?.checked !== false;
  const date = document.getElementById('g-date').value || new Date().toISOString().split('T')[0];
  const selfLoanBorrowReq = parseFloat(document.getElementById('g-selfloan-borrow')?.value)||0;
  const selfLoanRepayReq = parseFloat(document.getElementById('g-selfloan-repay')?.value)||0;
  const ccPayReq = parseFloat(document.getElementById('g-cc-pay')?.value)||0;
  const loanPayReq = parseFloat(document.getElementById('g-loan-pay')?.value)||0;
  const r = calcSurplus(fee, cart, type, applyHst, applyDues, date, null, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq);
  const dot = (c) => '<span style="width:7px;height:7px;border-radius:2px;background:'+c+';display:inline-block;margin-right:4px" aria-hidden="true"></span>';
  let surplusNote = '';
  if(r.baselineCovered) surplusNote = '<div style="font-size:11px;color:var(--green);padding:3px 0 5px">'+t('split_baseline_covered')+'</div>';
  else if(r.gigSurplus===0) surplusNote = '<div style="font-size:11px;color:var(--amber);padding:3px 0 5px">'+t('split_toward_baseline').replace('{amt}',fmt(r.baselineGap))+'</div>';
  else surplusNote = '<div style="font-size:11px;color:var(--sage);padding:3px 0 5px">'+t('split_surplus').replace('{amt}',fmt(r.gigSurplus))+'</div>';
  const selfLoanWarn = r.selfLoanCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">'+t('split_selfloan_capped').replace('{amt}',fmt(r.gigSurplus))+'</div>' : '';
  const selfLoanRepayWarn = r.selfLoanRepayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">'+t('split_selfloan_repay_capped')+'</div>' : '';
  const ccPayWarn = r.ccPayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">'+t('split_cc_capped')+'</div>' : '';
  const loanPayWarn = r.loanPayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">'+t('split_loan_capped')+'</div>' : '';
  const selfLoanRow = r.selfLoanBorrow>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+t('split_selfloan_borrowed')+'</span><span class="sv">-'+fmt2(r.selfLoanBorrow)+'</span></div>' : '';
  const selfLoanRepayRow = r.selfLoanRepay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+t('split_paying_back')+'</span><span class="sv">-'+fmt2(r.selfLoanRepay)+'</span></div>' : '';
  const ccPayRow = r.ccPay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--red)')+t('split_cc_payment')+'</span><span class="sv">-'+fmt2(r.ccPay)+'</span></div>' : '';
  const loanPayRow = r.loanPay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold)')+t('split_loan_payment')+'</span><span class="sv">-'+fmt2(r.loanPay)+'</span></div>' : '';
  const bktRows = r.buckets.filter(b=>b.name.toLowerCase()!=='invest').map(b => '<div class="split-row-item"><span class="sl">'+dot('var(--gold)')+b.name+'</span><span class="sv">'+fmt2(b.amt)+'</span></div>').join('');
  document.getElementById('gig-split-rows').innerHTML =
    '<div class="split-row-item"><span class="sl">'+t('split_income_tax')+'</span><span class="sv">'+fmt2(r.incomeTax)+'</span></div>'+
    (r.salesTax>0?'<div class="split-row-item"><span class="sl">'+t('split_sales_tax')+'</span><span class="sv">'+fmt2(r.salesTax)+'</span></div>':'')+
    (r.workDues>0?'<div class="split-row-item"><span class="sl">'+t('split_work_dues')+'</span><span class="sv">'+fmt2(r.workDues)+'</span></div>':'')+
    '<div class="split-row-item" style="border-top:1px solid rgba(74,102,91,.15);margin-top:4px;padding-top:6px"><span class="sl" style="font-weight:600;color:var(--sage-d)">'+t('split_net_liquid')+'</span><span class="sv" style="color:var(--sage)">'+fmt2(r.netLiquid)+'</span></div>'+
    surplusNote+selfLoanWarn+selfLoanRepayWarn+ccPayWarn+loanPayWarn+selfLoanRow+selfLoanRepayRow+ccPayRow+loanPayRow+
    (r.gigSurplus>0?
      '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+t('split_enjoy_next')+'</span><span class="sv">'+fmt2(r.enjoy)+'</span></div>'+
      bktRows+
      '<div class="split-row-item" style="font-weight:600"><span class="sl">'+dot('var(--sage)')+t('split_invest_remainder')+' \u2014 '+getInvestName()+'</span><span class="sv">'+fmt2(r.invest)+'</span></div>'
    :'');
  document.getElementById('gig-hisa-amt').textContent = fmt2(r.moveToHisa);
  const tip = document.getElementById('gig-hisa-tip');
  if(tip) tip.style.display = S.learnMode ? 'block' : 'none';
  document.getElementById('gig-split-area').style.display = 'block';
}

function saveGig(){
  const name = document.getElementById('g-name').value.trim();
  const date = document.getElementById('g-date').value;
  const isHistorical = document.getElementById('g-historical')?.checked || false;
  const fee = isHistorical ? 0 : (parseFloat(document.getElementById('g-fee').value)||0);
  const payer = document.getElementById('g-payer').value.trim();
  const includeInAccountantReport = document.getElementById('g-include-acct')?.checked !== false;
  // Clear previous errors
  ['f-date','f-name','f-payer','f-fee'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.classList.remove('error');
  });
  let hasError = false;
  if(!date){ const el=document.getElementById('f-date'); if(el) el.classList.add('error'); hasError=true; }
  if(!name){ const el=document.getElementById('f-name'); if(el) el.classList.add('error'); hasError=true; }
  if(!payer){ const el=document.getElementById('f-payer'); if(el) el.classList.add('error'); hasError=true; }
  if(!isHistorical && !fee){ const el=document.getElementById('f-fee'); if(el) el.classList.add('error'); hasError=true; }
  if(hasError){
    const sheet = document.querySelector('#gig-modal .sheet');
    if(sheet) sheet.scrollTop = 0;
    return;
  }
  // Historical entry — use manual fields directly, bypass calculation
  if(isHistorical){
    const editId = window.editingGigId || null;
    const notes = document.getElementById('g-notes')?.value.trim()||'';
    const status = document.getElementById('g-status').value;
    const hFee = parseFloat(document.getElementById('h-fee')?.value)||0;
    const hCart = parseFloat(document.getElementById('h-cart')?.value)||0;
    const hTax = parseFloat(document.getElementById('h-tax')?.value)||0;
    const hHst = parseFloat(document.getElementById('h-hst')?.value)||0;
    const hDues = parseFloat(document.getElementById('h-dues')?.value)||0;
    const hNet = parseFloat(document.getElementById('h-net')?.value)||0;
    const hEnjoy = parseFloat(document.getElementById('h-enjoy')?.value)||0;
    const hInvest = parseFloat(document.getElementById('h-invest')?.value)||0;
    const hCc = parseFloat(document.getElementById('h-cc')?.value)||0;
    const hLoan = parseFloat(document.getElementById('h-loan')?.value)||0;
    const hSlBorrow = parseFloat(document.getElementById('h-sl-borrow')?.value)||0;
    const hSlRepay = parseFloat(document.getElementById('h-sl-repay')?.value)||0;
    const hType = document.getElementById('h-type')?.value||'Freelance';
    const hNotes = document.getElementById('h-notes')?.value.trim()||'';
    // Transfer to set-aside account = gov money + enjoy-life. Work dues never go here (deduction only); historical mode has no per-bucket breakdown.
    const hisaTransfer = hTax + hHst + hEnjoy;
    const gig = {
      id: editId || Date.now(), entryOrder: editId ? (S.gigs.find(g=>g.id===editId)?.entryOrder||Date.now()) : Date.now(),
      date, name, payer, notes:hNotes||notes, status, type:hType,
      fee:hFee, cart:hCart, applyHst:false, applyDues:false,
      isHistorical:true, includeInAccountantReport,
      incomeTax:hTax, salesTax:hHst, workDues:hDues,
      hisa:hisaTransfer, netLiquid:hNet, gigSurplus:Math.max(0,hNet),
      enjoy:hEnjoy, buckets:[], invest:hInvest, moveToHisa:hisaTransfer,
      ccPay:hCc, loanPay:hLoan, selfLoanBorrow:hSlBorrow, selfLoanRepay:hSlRepay, flag:''
    };
    if(editId){ S.gigs = S.gigs.map(g=>g.id===editId?gig:g); }
    else { S.gigs.push(gig); }
    if(hCc>0) S.debt.cc = Math.max(0,(S.debt.cc||0)-hCc);
    if(hLoan>0) S.debt.loan = Math.max(0,(S.debt.loan||0)-hLoan);
    if(hSlBorrow>0) S.selfLoan = (S.selfLoan||0)+hSlBorrow;
    if(hSlRepay>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-hSlRepay);
    S.funFund.next = (S.funFund.next||0)+hEnjoy;
    track(editId?'gig_edited':'gig_logged_historical');
    save();
    closeOv('gig-modal');
    window.editingGigId = null;
    document.getElementById('hm-amt').textContent = fmt2(hisaTransfer);
    document.getElementById('hm-sub').textContent = t('hm_sub_historical').replace('{name}',name);
    const saName2 = getSetAsideName();
    const hdrEl2 = document.getElementById('hm-acct-header');
    const tfrEl2 = document.getElementById('hm-transfer-header');
    if(hdrEl2) hdrEl2.textContent = t('hm_move_now').replace('{account}',saName2);
    if(tfrEl2) tfrEl2.textContent = t('hm_transfer').replace('{account}',saName2);
    const bd = document.getElementById('hm-breakdown');
    if(bd) bd.innerHTML = hisaTransfer>0 ?
      '<div style="font-size:13px;color:var(--muted);padding:4px 0">'+t('hm_tax_dues_note').replace('{amt}',fmt2(hisaTransfer))+'</div>' : '';
    openOv('hisa-modal');
    updateDash(); renderGigs();
    return;
  }
  if(!fee){ const el=document.getElementById('f-fee'); if(el) el.classList.add('error'); hasError=true; }
  if(hasError){ 
    // Scroll to top of sheet so errors are visible
    const sheet = document.querySelector('#gig-modal .sheet');
    if(sheet) sheet.scrollTop = 0;
    return; 
  }
  const cart = parseFloat(document.getElementById('g-cart').value)||0;
  const type = document.getElementById('g-type').value;
  const status = document.getElementById('g-status').value;
  const notes = document.getElementById('g-notes')?.value.trim()||'';
  const applyHst = document.getElementById('g-hst')?.checked||false;
  const applyDues = document.getElementById('g-dues')?.checked!==false;
  S.lastHstToggle = applyHst;
  S.lastDuesToggle = applyDues;
  const ccPayReq = parseFloat(document.getElementById('g-cc-pay')?.value)||0;
  const loanPayReq = parseFloat(document.getElementById('g-loan-pay')?.value)||0;
  const selfLoanBorrowReq = parseFloat(document.getElementById('g-selfloan-borrow')?.value)||0;
  const selfLoanRepayReq = parseFloat(document.getElementById('g-selfloan-repay')?.value)||0;
  const editId = window.editingGigId || null;
  const r = calcSurplus(fee, cart, type, applyHst, applyDues, date, editId, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq);
  const gig = {
    id: editId || Date.now(), entryOrder: editId ? (S.gigs.find(g=>g.id===editId)?.entryOrder || Date.now()) : Date.now(),
    date, name, payer, notes, type, status,
    fee, cart, applyHst, applyDues, includeInAccountantReport,
    workDues:r.workDues, salesTax:r.salesTax, incomeTax:r.incomeTax,
    hisa:r.hisa, netLiquid:r.netLiquid, gigSurplus:r.gigSurplus,
    enjoy:r.enjoy, buckets:r.buckets, invest:r.invest, moveToHisa:r.moveToHisa,
    ccPay:r.ccPay, loanPay:r.loanPay, selfLoanBorrow:r.selfLoanBorrow, selfLoanRepay:r.selfLoanRepay,
    flagDebtBeforeBaseline: !r.baselineCovered && (r.ccPay>0||r.loanPay>0)
  };
  if(editId){
    // Editing: reverse the old gig's effect on debt/self-loan before applying new values
    const old = S.gigs.find(g=>g.id===editId);
    if(old){
      if(old.ccPay>0) S.debt.cc = (S.debt.cc||0)+old.ccPay;
      if(old.loanPay>0) S.debt.loan = (S.debt.loan||0)+old.loanPay;
      if(old.selfLoanBorrow>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-old.selfLoanBorrow);
      if(old.selfLoanRepay>0) S.selfLoan = (S.selfLoan||0)+old.selfLoanRepay;
    }
    S.gigs = S.gigs.map(g=>g.id===editId?gig:g);
  } else {
    S.gigs.push(gig);
  }
  if(r.ccPay>0) S.debt.cc = Math.max(0,(S.debt.cc||0)-r.ccPay);
  if(r.loanPay>0) S.debt.loan = Math.max(0,(S.debt.loan||0)-r.loanPay);
  if(r.selfLoanBorrow>0) S.selfLoan = (S.selfLoan||0)+r.selfLoanBorrow;
  if(r.selfLoanRepay>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-r.selfLoanRepay);
  S.funFund.next = (S.funFund.next||0) + r.enjoy;
  // Check for any savings goals reached with this gig's contribution — auto-redirect to invest
  window._goalsReachedThisSave = [];
  r.buckets.forEach(rb=>{
    const bucket=S.buckets.find(b=>b.name===rb.name);
    if(bucket && bucket.goalAmt>0 && bucket.pct>0){
      const allTimeSaved=S.gigs.filter(g=>g.status==='Received').reduce((t,g)=>t+(g.buckets.find(x=>x.name===bucket.name)||{amt:0}).amt,0)-(bucket.spentTotal||0);
      if(allTimeSaved>=bucket.goalAmt){
        window._goalsReachedThisSave.push(bucket.name);
        bucket.pct=0;
      }
    }
  });
  track(editId?'gig_edited':'gig_logged',{type,status});
  save();
  closeOv('gig-modal');
  window.editingGigId = null;
  document.getElementById('hm-amt').textContent = fmt2(r.moveToHisa);
  document.getElementById('hm-sub').textContent = t('hm_sub_logged').replace('{name}',name);
  const saName = getSetAsideName();
  const hdrEl = document.getElementById('hm-acct-header');
  const tfrEl = document.getElementById('hm-transfer-header');
  if(hdrEl) hdrEl.textContent = t('hm_move_now').replace('{account}',saName);
  if(tfrEl) tfrEl.textContent = t('hm_transfer').replace('{account}',saName);
  const hmtip = document.getElementById('hm-tip');
  if(hmtip) hmtip.style.display = S.learnMode ? 'block' : 'none';
  // HISA breakdown: stays vs moves back on 1st
  const govMoney = r.incomeTax + r.salesTax;
  const savingsBkts = r.buckets.reduce((tt,b)=>tt+b.amt, 0);
  const breakdownEl = document.getElementById('hm-breakdown');
  if(breakdownEl){
    const row = (label, val, sub) =>
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:4px 0;border-bottom:1px solid rgba(74,102,91,.1);font-size:13px">'+
      '<span style="color:var(--muted);flex:1">'+label+(sub?'<br><span style="font-size:10px;color:var(--sage)">'+sub+'</span>':'')+'</span>'+
      '<span style="font-weight:600;color:var(--sage-d);margin-left:8px">'+fmt2(val)+'</span></div>';
    const goalAnnounce = (window._goalsReachedThisSave||[]).map(name=>
      '<div style="background:var(--gold-l);border-radius:var(--rs);padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--gold-d);line-height:1.5">'+t('goal_reached_announce').replace('{name}',name)+'</div>'
    ).join('');
    breakdownEl.innerHTML = goalAnnounce +
      (govMoney>0 ? row(t('hm_gov_label'),''+govMoney,t('hm_gov_sub')) : '')+
      (savingsBkts>0 ? row(t('hm_savings_label'),''+savingsBkts,t('hm_savings_sub')) : '')+
      (r.enjoy>0 ? row(t('hm_enjoy_label'),''+r.enjoy,t('hm_enjoy_sub')) : '')+
      (r.invest>0 ? row(t('hm_invest_label'),''+r.invest,t('hm_invest_sub').replace('{account}',getInvestName())) : '');
  }
  openOv('hisa-modal');
  updateDash(); renderGigs();
}

function editGig(id){
  const g = S.gigs.find(x=>x.id===id); if(!g) return;
  window.editingGigId = id;
  document.getElementById('g-date').value = g.date;
  document.getElementById('g-status').value = g.status;
  document.getElementById('g-name').value = g.name;
  document.getElementById('g-payer').value = g.payer||'';
  document.getElementById('g-type').value = g.type||'Freelance';
  document.getElementById('g-fee').value = g.fee||'';
  document.getElementById('g-cart').value = g.cart||'';
  document.getElementById('g-hst').checked = !!g.applyHst;
  document.getElementById('g-dues').checked = g.applyDues!==false;
  document.getElementById('g-include-acct').checked = g.includeInAccountantReport!==false;
  document.getElementById('g-cc-pay').value = g.ccPay||'';
  document.getElementById('g-loan-pay').value = g.loanPay||'';
  document.getElementById('g-selfloan-borrow').value = g.selfLoanBorrow||'';
  document.getElementById('g-selfloan-repay').value = g.selfLoanRepay||'';
  document.getElementById('g-notes').value = g.notes||'';
  ['f-date','f-name','f-payer','f-fee'].forEach(fid=>{const el=document.getElementById(fid);if(el)el.classList.remove('error');});
  const histToggle = document.getElementById('g-historical');
  if(g.isHistorical){
    if(histToggle) histToggle.checked = true;
    document.getElementById('historical-toggle-row').style.display='block';
    toggleHistoricalMode();
    const setH = (hid, val) => { const el=document.getElementById(hid); if(el) el.value=val||''; };
    setH('h-fee', g.fee); setH('h-cart', g.cart);
    setH('h-tax', g.incomeTax); setH('h-hst', g.salesTax); setH('h-dues', g.workDues);
    setH('h-net', g.netLiquid); setH('h-enjoy', g.enjoy); setH('h-invest', g.invest);
    setH('h-cc', g.ccPay); setH('h-loan', g.loanPay);
    setH('h-sl-borrow', g.selfLoanBorrow); setH('h-sl-repay', g.selfLoanRepay);
    setH('h-notes', g.notes);
    const hTypeEl = document.getElementById('h-type');
    if(hTypeEl) hTypeEl.value = g.type||'Freelance';
    calcHistoricalHisa();
  } else {
    if(histToggle) histToggle.checked = false;
    document.getElementById('historical-toggle-row').style.display='none';
    document.getElementById('historical-fields').style.display='none';
    document.getElementById('main-gig-fields').style.display='block';
    calcGigModal();
  }
  document.querySelector('#gig-modal .m-title').textContent = t('gig_edit_title');
  document.querySelector('#gig-modal .btn-p').textContent = t('btn_save_changes');
  openOv('gig-modal');
}

function deleteGig(id){
  const g = S.gigs.find(x=>x.id===id); if(!g) return;
  const confirmed = confirm('"'+g.name+'" on '+fmtD(g.date)+' — permanently remove this entry?');
  if(!confirmed) return;
  // Reverse any effects on debt and self-loan balances
  if(g.ccPay>0) S.debt.cc = (S.debt.cc||0)+g.ccPay;
  if(g.loanPay>0) S.debt.loan = (S.debt.loan||0)+g.loanPay;
  if(g.selfLoanBorrow>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-g.selfLoanBorrow);
  if(g.selfLoanRepay>0) S.selfLoan = (S.selfLoan||0)+g.selfLoanRepay;
  // Reverse enjoy-life from fun fund (from next month's amount)
  if(g.enjoy>0) S.funFund.next = Math.max(0,(S.funFund.next||0)-g.enjoy);
  S.gigs = S.gigs.filter(x=>x.id!==id);
  save();
  track('gig_deleted');
  showPage('gigs');
  updateDash();
}

function updateDash(){
  const s=S.settings; const now=new Date(); const m=now.getMonth(); const y=now.getFullYear();
  const rec=S.gigs.filter(g=>g.status==='Received');
  const mG=rec.filter(g=>{const d=new Date(g.date+'T12:00:00');return d.getMonth()===m&&d.getFullYear()===y;});
  const mInc=mG.reduce((t,g)=>t+g.netLiquid,0);
  const st=document.getElementById('d-status');
  if(mInc>=s.baseline&&s.baseline>0){st.className='pill pill-green';st.innerHTML='<i class="ti ti-circle-check" aria-hidden="true"></i> '+t('dash_baseline_covered');}
  else if(mInc>0){st.className='pill pill-amber';st.innerHTML='<i class="ti ti-alert-circle" aria-hidden="true"></i> '+t('dash_to_go').replace('{amt}',fmt(s.baseline-mInc));}
  else{st.className='pill pill-red';st.innerHTML='<i class="ti ti-alert-circle" aria-hidden="true"></i> '+t('dash_no_income');}
  document.getElementById('d-income').textContent=fmt(mInc);
  document.getElementById('d-baseline').textContent=fmt(s.baseline);
  document.getElementById('fun-amt').textContent=fmt(S.funFund.current||0);
  const ytd=rec.filter(g=>new Date(g.date+'T12:00:00').getFullYear()===y);
  document.getElementById('d-ytd').textContent=fmt(ytd.reduce((t,g)=>t+g.netLiquid,0));
  document.getElementById('d-hisa').textContent=fmt(ytd.reduce((t,g)=>t+(g.moveToHisa||0),0));
  const dHisaLbl=document.getElementById('d-hisa-lbl'); if(dHisaLbl) dHisaLbl.textContent=t('dash_in_account').replace('{account}',getSetAsideName());
  updateCheckinDot();
  updateInvestTrend();
  // Runway from account balances
  const totalLiquid=(S.balances?.checking||0)+(S.balances?.savings||0);
  const runway=s.baseline>0?totalLiquid/s.baseline:0;
  document.getElementById('d-runway').textContent=runway>0?runway.toFixed(1):'—';
  const pct=Math.min(100,(runway/6)*100);
  document.getElementById('rwfill').style.width=pct+'%';
  document.getElementById('rwfill').style.background=runway<1?'var(--red)':runway<3?'var(--amber)':'var(--sage)';
  // Building future %
  const ago=new Date(now-90*864e5);
  const r90=rec.filter(g=>new Date(g.date+'T12:00:00')>=ago);
  const n90=r90.reduce((t,g)=>t+g.netLiquid,0);
  const b90=r90.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0);
  document.getElementById('d-bld').textContent=n90>0?Math.round(b90/n90*100)+'%':'0%';
  // Debt section
  const totalDebt=(S.debt?.cc||0)+(S.debt?.loan||0);
  const debtEl=document.getElementById('d-debt-section');
  if(debtEl){
    if(totalDebt>0){
      const ytdDebt=ytd.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0);
      debtEl.innerHTML='<div style="margin:0 14px 10px;background:var(--gold-l);border-radius:var(--rs);padding:12px 13px">'+
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--red);margin-bottom:6px">'+t('dash_debt_label')+'</div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">'+t('dash_total_owing')+'</span><span style="font-weight:600;color:var(--red)">'+fmt(totalDebt)+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">'+t('dash_paid_down')+'</span><span style="font-weight:500">'+fmt(ytdDebt)+'</span></div>'+
        '</div>';
    } else { debtEl.innerHTML=''; }
  }
  // Self-loan section (separate from debt — owed to yourself)
  const selfLoanEl=document.getElementById('d-selfloan-section');
  if(selfLoanEl){
    if((S.selfLoan||0)>0){
      const ytdRepaid=ytd.reduce((t,g)=>t+(g.selfLoanRepay||0),0);
      selfLoanEl.innerHTML='<div style="margin:0 14px 10px;background:var(--gold-l);border-radius:var(--rs);padding:12px 13px">'+
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--gold-d);margin-bottom:6px">'+t('dash_selfloan_label')+'</div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">'+t('dash_owed_self')+'</span><span style="font-weight:600;color:var(--gold-d)">'+fmt(S.selfLoan)+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">'+t('dash_repaid_year')+'</span><span style="font-weight:500">'+fmt(ytdRepaid)+'</span></div>'+
        '</div>';
    } else { selfLoanEl.innerHTML=''; }
  }
  // Momentum chart
  renderMomentumChart();
  renderProgressCard();
  const recent=S.gigs.slice().sort((a,b)=>new Date(b.date)-new Date(a.date) || (b.entryOrder||0)-(a.entryOrder||0)).slice(0,4);
  document.getElementById('d-recent').innerHTML=recent.length?recent.map(gigRow).join(''):'<div class="empty"><i class="ti ti-music" aria-hidden="true"></i><p>'+t('dash_no_gigs')+'</p></div>';
  ensureTipMarkers(); checkAutoTips();
}

function toggleAdvancedSettings(){
  const body=document.getElementById('adv-settings-body');
  const chevron=document.getElementById('adv-chevron');
  const open=body.style.display==='none';
  body.style.display=open?'block':'none';
  chevron.style.transform=open?'rotate(180deg)':'rotate(0deg)';
}
function statusLabel(status){
  return status==='Received' ? t('gig_status_received') : status==='Pending' ? t('gig_status_pending') : status;
}
function gigRow(g){
  const ico={Freelance:'ti-music',Employment:'ti-building',Instruction:'ti-school',Other:'ti-receipt'}[g.type]||'ti-music';
  const bc=g.status==='Received'?'b-g':'b-a';
  const histBadge=g.isHistorical?'<span class="badge" style="background:var(--gold-l);color:var(--gold-d);margin-left:3px">H</span>':'';
  const amt=g.isHistorical?(g.netLiquid||0).toFixed(0):(g.fee||0).toFixed(0);
  return'<div class="gig-row" onclick="showDetail('+g.id+')" role="button" tabindex="0" aria-label="'+g.name+', '+fmtD(g.date)+'" onkeydown="if(event.keyCode===13||event.key==="Enter")showDetail('+g.id+')">'+
    '<div class="gig-ico" aria-hidden="true"><i class="ti '+ico+'"></i></div>'+
    '<div class="gig-info"><div class="gig-name">'+g.name+'</div><div class="gig-meta">'+fmtD(g.date)+(g.payer?' · '+g.payer:'')+'</div></div>'+
    '<div class="gig-right"><div class="gig-amt">'+currSym()+amt+'</div><span class="badge '+bc+'">'+statusLabel(g.status)+'</span>'+histBadge+'</div></div>';
}

function typeLabel(type){
  return type==='Freelance'?t('det_type_freelance'):type==='Employment'?t('det_type_employment'):type==='Instruction'?t('det_type_instruction'):t('det_type_other');
}
function showDetail(id){
  const g=S.gigs.find(x=>x.id===id); if(!g) return;
  const bc=g.status==='Received'?'b-g':'b-a';
  const dot=(c)=>'<span style="width:7px;height:7px;border-radius:2px;background:'+c+';display:inline-block;margin-right:4px"></span>';
  let html='<div class="det-sec">';
  html+='<div class="det-row"><span>'+t('det_date')+'</span><span>'+fmtD(g.date)+'</span></div>';
  html+='<div class="det-row"><span>'+t('gig_status')+'</span><span><span class="badge '+bc+'">'+statusLabel(g.status)+'</span></span></div>';
  html+='<div class="det-row"><span>'+t('gig_payer')+'</span><span>'+(g.payer||'—')+'</span></div>';
  html+='<div class="det-row"><span>'+t('det_type')+'</span><span>'+typeLabel(g.type)+'</span></div>';
  html+='<div class="det-row"><span>'+t('gig_scale_fee')+'</span><span>'+fmt2(g.fee)+'</span></div>';
  if(g.cart>0) html+='<div class="det-row"><span>'+t('det_cartage')+'</span><span>'+fmt2(g.cart)+'</span></div>';
  if(g.notes) html+='<div class="det-row"><span>'+t('hist_notes')+'</span><span>'+g.notes+'</span></div>';
  html+='</div>';
  const flagText = g.flagDebtBeforeBaseline ? t('flag_debt_before_baseline') : (g.flag||'');
  if(flagText) html+='<div style="background:var(--amber-l);border-left:3px solid var(--amber);border-radius:var(--rs);padding:10px 12px;font-size:12px;color:var(--amber);margin:8px 16px">'+flagText+'</div>';
  html+='<div class="det-hisa"><span>'+t('hm_transfer').replace('{account}',getSetAsideName())+'</span><span>'+fmt2(g.moveToHisa||0)+'</span></div>';
  html+='<div class="det-sec">';
  html+='<div class="det-row"><span>'+t('split_income_tax')+'</span><span>'+fmt2(g.incomeTax||0)+'</span></div>';
  if((g.salesTax||0)>0) html+='<div class="det-row"><span>'+t('split_sales_tax')+'</span><span>'+fmt2(g.salesTax)+'</span></div>';
  if((g.workDues||0)>0) html+='<div class="det-row"><span>'+t('split_work_dues')+'</span><span>'+fmt2(g.workDues)+'</span></div>';
  html+='<div class="det-row" style="font-weight:600;color:var(--sage-d)"><span>'+t('split_net_liquid')+'</span><span>'+fmt2(g.netLiquid||0)+'</span></div>';
  html+='</div>';
  if((g.gigSurplus||0)>0){
    html+='<div class="det-sec">';
    html+='<div class="det-row"><span style="color:var(--muted)">'+t('det_surplus')+'</span><span style="color:var(--sage)">'+fmt2(g.gigSurplus)+'</span></div>';
    html+='<div class="det-row"><span>'+dot('var(--gold-d)')+t('split_enjoy_next')+'</span><span>'+fmt2(g.enjoy||0)+'</span></div>';
    if(g.buckets) html+=g.buckets.filter(b=>b.name.toLowerCase()!=='invest').map(b=>'<div class="det-row"><span>'+dot('var(--gold)')+b.name+'</span><span>'+fmt2(b.amt)+'</span></div>').join('');
    html+='<div class="det-row" style="font-weight:600"><span>'+dot('var(--sage)')+t('exp_invest')+' \u2014 '+getInvestName()+'</span><span>'+fmt2(g.invest||0)+'</span></div>';
    html+='</div>';
  }
  if((g.ccPay||0)>0||(g.loanPay||0)>0){
    html+='<div class="det-sec">';
    if(g.ccPay>0) html+='<div class="det-row" style="color:var(--red)"><span>'+t('split_cc_payment')+'</span><span>'+fmt2(g.ccPay)+'</span></div>';
    if(g.loanPay>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>'+t('split_loan_payment')+'</span><span>'+fmt2(g.loanPay)+'</span></div>';
    html+='</div>';
  }
  if((g.selfLoanBorrow||0)>0||(g.selfLoanRepay||0)>0){
    html+='<div class="det-sec">';
    if(g.selfLoanBorrow>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>'+t('split_selfloan_borrowed')+'</span><span>'+fmt2(g.selfLoanBorrow)+'</span></div>';
    if(g.selfLoanRepay>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>'+t('det_selfloan_repaid')+'</span><span>'+fmt2(g.selfLoanRepay)+'</span></div>';
    html+='</div>';
  }
  html+='<div style="padding:12px 16px 4px"><button class="btn-outline" onclick="editGig('+g.id+')">'+t('det_edit_entry')+'</button></div>';
  html+='<div style="margin:8px 16px 0;border-top:1px solid var(--border)"></div>';
  html+='<div style="padding:8px 16px 28px"><button style="width:100%;padding:12px;border-radius:var(--rs);border:1.5px solid var(--red);background:none;color:var(--red);font-size:14px;font-family:var(--font);cursor:pointer" onclick="deleteGig('+g.id+')">'+t('det_remove_entry')+'</button></div>';
  document.getElementById('det-content').innerHTML=html;
  track('gig_detail_viewed');
  showPage('detail');
}

function openGigModal(){
  window.editingGigId = null;
  document.getElementById('g-date').value=new Date().toISOString().split('T')[0];
  ['g-name','g-payer','g-fee','g-cart','g-notes','g-cc-pay','g-loan-pay','g-selfloan-borrow','g-selfloan-repay'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['h-fee','h-cart','h-tax','h-hst','h-dues','h-net','h-enjoy','h-invest','h-cc','h-loan','h-sl-borrow','h-sl-repay','h-notes','g-check-amt'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  const hTypeEl=document.getElementById('h-type'); if(hTypeEl) hTypeEl.value='Freelance';
  const checkRes=document.getElementById('g-check-result'); if(checkRes) checkRes.textContent='—';
  ['f-date','f-name','f-payer','f-fee'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('error');});
  const hist=document.getElementById('g-historical'); if(hist) hist.checked=false;
  const gType=document.getElementById('g-type'); if(gType) gType.value='Freelance';
  const hst=document.getElementById('g-hst'); if(hst) hst.checked = S.lastHstToggle===true;
  const dues=document.getElementById('g-dues'); if(dues) dues.checked = S.lastDuesToggle!==false;
  const inclAcct=document.getElementById('g-include-acct'); if(inclAcct) inclAcct.checked = true;
  document.getElementById('gig-split-area').style.display='none';
  document.getElementById('historical-toggle-row').style.display='none';
  document.getElementById('historical-fields').style.display='none';
  document.getElementById('main-gig-fields').style.display='block';
  document.querySelector('#gig-modal .m-title').textContent = t('gig_title');
  document.querySelector('#gig-modal .btn-p').textContent = t('btn_add_gig');
  openOv('gig-modal');
}
document.addEventListener('DOMContentLoaded',function(){
  const fab=document.getElementById('fab');
  if(fab) fab.addEventListener('click',openGigModal);
});
let filtState='all';
function updateFilterPills(){
  const hasPending=S.gigs.some(g=>g.status==='Pending');
  ['all','Received','Pending'].forEach(x=>{
    const el=document.getElementById('f'+{all:'a',Received:'r',Pending:'p'}[x]);
    if(!el) return;
    el.style.cursor='pointer';el.style.border='none';
    el.style.background='';el.style.color='';
    if(x===filtState){el.className='pill pill-green';}
    else if(x==='Pending'&&hasPending){el.className='pill pill-amber';}
    else{el.className='pill';el.style.background='var(--sage-l)';el.style.color='var(--muted)';}
  });
}
function filt(f){
  filtState=f;
  updateFilterPills();
  renderGigs();
}
function sortGigList(list, mode){
  if(mode==='newest') list.sort((a,b)=>new Date(b.date)-new Date(a.date) || (b.entryOrder||0)-(a.entryOrder||0));
  else if(mode==='oldest') list.sort((a,b)=>new Date(a.date)-new Date(b.date) || (a.entryOrder||0)-(b.entryOrder||0));
  else if(mode==='historical'){
    const hist = list.filter(g=>g.isHistorical).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const reg = list.filter(g=>!g.isHistorical).sort((a,b)=>new Date(b.date)-new Date(a.date));
    list = [...hist, ...reg];
  }
  else if(mode==='pending'){
    const pend = list.filter(g=>g.status==='Pending').sort((a,b)=>new Date(a.date)-new Date(b.date));
    const recv = list.filter(g=>g.status!=='Pending').sort((a,b)=>new Date(b.date)-new Date(a.date));
    list = [...pend, ...recv];
  }
  return list;
}
function renderGigs(){
  updateFilterPills();
  // Populate year dropdown once
  const yearSel = document.getElementById('gig-year');
  if(yearSel && yearSel.options.length<=1){
    const years = new Set(S.gigs.map(g=>new Date(g.date+'T12:00:00').getFullYear()));
    years.add(new Date().getFullYear());
    Array.from(years).sort((a,b)=>b-a).forEach(y=>{
      const opt = document.createElement('option');
      opt.value=y; opt.textContent=y;
      yearSel.appendChild(opt);
    });
  }
  let list=filtState==='all'?S.gigs.slice():S.gigs.filter(g=>g.status===filtState);
  const yearFilter = document.getElementById('gig-year')?.value || 'all';
  if(yearFilter!=='all') list = list.filter(g=>new Date(g.date+'T12:00:00').getFullYear()===parseInt(yearFilter));
  // Search filter
  const searchTerm = (document.getElementById('gig-search')?.value||'').toLowerCase().trim();
  if(searchTerm) list = list.filter(g=>
    (g.name||'').toLowerCase().includes(searchTerm) ||
    (g.payer||'').toLowerCase().includes(searchTerm) ||
    (g.notes||'').toLowerCase().includes(searchTerm)
  );
  const sortMode = document.getElementById('gig-sort')?.value || 'newest';
  list = sortGigList(list, sortMode);
  document.getElementById('gigs-ct').textContent=list.length+' entr'+(list.length===1?'y':'ies');
  document.getElementById('gigs-list').innerHTML=list.length?list.map(gigRow).join(''):'<div class="empty"><i class="ti ti-music" aria-hidden="true"></i><p>No gigs here yet.</p></div>';
}

// ===== REPORTS =====
function getReportYears(){
  const years = new Set(S.gigs.filter(g=>g.status==='Received').map(g=>new Date(g.date+'T12:00:00').getFullYear()));
  years.add(new Date().getFullYear());
  return Array.from(years).sort((a,b)=>b-a);
}
function renderRepList(){
  const sel = document.getElementById('rep-year');
  if(sel && sel.options.length===0){
    getReportYears().forEach(y=>{
      const opt = document.createElement('option');
      opt.value=y; opt.textContent='Tax year: '+y;
      sel.appendChild(opt);
    });
  }
}
// Shared 90-day pace projection for a savings-goal bucket. Used by the Goals Progress report
// and by the "Time to your number" section of Your Progress (Part C) — same calculation, one place.
function computeGoalProjection(b){
  const end=new Date(); const start=new Date(); start.setDate(start.getDate()-90);
  const recentGigs = S.gigs.filter(g=>g.status==='Received'&&new Date(g.date+'T12:00:00')>=start&&new Date(g.date+'T12:00:00')<=end);
  const allGigs = S.gigs.filter(g=>g.status==='Received');
  const saved = allGigs.reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0)-(b.spentTotal||0);
  const pct = Math.min(100, Math.round(saved/b.goalAmt*100));
  const remaining = Math.max(0, b.goalAmt-saved);
  const recentContrib = recentGigs.reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0);
  const monthlyRate = recentContrib/3;
  let status, projDate=null, monthsNeeded=null;
  if(saved>=b.goalAmt){ status='reached'; }
  else if(monthlyRate>0){
    monthsNeeded=Math.ceil(remaining/monthlyRate);
    projDate=new Date(); projDate.setMonth(projDate.getMonth()+monthsNeeded);
    status='projected';
  } else { status='no_pace'; }
  return {saved, pct, remaining, monthlyRate, status, projDate, monthsNeeded};
}
let currentReportExport = null;
function showRep(type){
  const y = parseInt(document.getElementById('rep-year')?.value) || new Date().getFullYear();
  const rec = S.gigs.filter(g=>g.status==='Received' && new Date(g.date+'T12:00:00').getFullYear()===y);
  const reps = {
    accountant: { title:t('rep_card_accountant_title'), rows:[], custom: true },
    giglog: { title:t('rep_card_giglog_title'), rows:[
      [t('rep_tax_year'),y],[t('rep_total_entries'),rec.length],
      [t('rep_total_gross'),fmt(rec.reduce((t,g)=>t+g.fee+(g.cart||0),0))],
      [t('rep_total_net_liquid'),fmt(rec.reduce((t,g)=>t+g.netLiquid,0))]
    ]},
    snapshot: { title:t('rep_card_snapshot_title'), rows:[
      [t('rep_tax_year'),y],
      [t('rep_net_income'),fmt(rec.reduce((t,g)=>t+g.netLiquid,0))],
      [t('rep_total_to').replace('{account}',getSetAsideName()),fmt(rec.reduce((t,g)=>t+(g.moveToHisa||0),0))],
      [t('rep_enjoy_total'),fmt(rec.reduce((t,g)=>t+(g.enjoy||0),0))],
      [t('rep_savings_total'),fmt(rec.reduce((t,g)=>t+g.buckets.reduce((s2,b)=>s2+b.amt,0),0))],
      [t('rep_invested_total'),fmt(rec.reduce((t,g)=>t+(g.invest||0),0))],
      [t('rep_debt_paid'),fmt(rec.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0))],
      [t('split_selfloan_borrowed'),fmt(rec.reduce((t,g)=>t+(g.selfLoanBorrow||0),0))],
      [t('det_selfloan_repaid'),fmt(rec.reduce((t,g)=>t+(g.selfLoanRepay||0),0))],
      [t('rep_building_future'),(rec.reduce((t,g)=>t+g.netLiquid,0)>0
        ?Math.round(rec.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0)/rec.reduce((t,g)=>t+g.netLiquid,0)*100)
        :0)+'%']
    ]},
    invest: { title:t('rep_card_invest_title'), rows:
      rec.length
        ? [[t('rep_tax_year'),y],[t('rep_total_invested_auto'),fmt(rec.reduce((t,g)=>t+(g.invest||0),0))],
           ...S.buckets.map(b=>[t('rep_bucket_ytd').replace('{name}',b.name),fmt(rec.reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0))])]
        : [[t('rep_no_gigs_logged'),'—']]
    },
    audit: { title:t('rep_card_audit_title'), rows:[], custom: true },
    goals: { title:t('rep_card_goals_title'), rows:[], custom: true }
  };
  const r = reps[type];
  document.getElementById('rep-title').textContent = r.title+' — '+y;
  if(type==='accountant'){
    // Custom accountant report: freelance/other only, gig-by-gig table
    const acctSortMode = S.lastRepSort || 'newest';
    const freelanceRec = sortGigList(rec.filter(g=>g.type!=='Employment' && g.includeInAccountantReport!==false), acctSortMode);
    const totalGross = freelanceRec.reduce((t,g)=>t+(g.fee||0)+(g.cart||0),0);
    const totalHst = freelanceRec.reduce((t,g)=>t+(g.salesTax||0),0);
    const totalDues = freelanceRec.reduce((t,g)=>t+(g.workDues||0),0);
    const totalTax = freelanceRec.reduce((t,g)=>t+(g.incomeTax||0),0);
    const sortOpt = (val,label) => '<option value="'+val+'"'+(acctSortMode===val?' selected':'')+'>'+label+'</option>';
    const rows = freelanceRec.map(g=>`
      <div class="rep-row" style="font-size:12px;flex-wrap:wrap;gap:2px">
        <span style="flex:0 0 70px;color:var(--muted)">${fmtD(g.date)}</span>
        <span style="flex:1;min-width:100px">${g.name}</span>
        <span style="flex:0 0 90px;color:var(--muted);font-size:11px">${g.payer||'—'}</span>
        <span style="flex:0 0 60px;text-align:right">${fmt2((g.fee||0)+(g.cart||0))}</span>
        <span style="flex:0 0 55px;text-align:right;color:var(--sage)">${g.salesTax>0?fmt2(g.salesTax):'—'}</span>
        <span style="flex:0 0 50px;text-align:right;color:var(--muted)">${g.workDues>0?fmt2(g.workDues):'—'}</span>
        <span style="flex:0 0 60px;text-align:right;color:var(--gold-d)">${fmt2(g.incomeTax||0)}</span>
      </div>`).join('');
    document.getElementById('rep-content').innerHTML =
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:8px">'+t('rep_acct_freelance_note')+'</div>'+
      '<div style="display:flex;justify-content:flex-end;margin-bottom:8px">'+
        '<select id="rep-acct-sort" onchange="saveRepSort();showRep(\'accountant\')" style="padding:7px 9px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;font-family:var(--font);color:var(--muted);background:var(--white)" aria-label="Sort report entries">'+
          sortOpt('newest','Newest first')+sortOpt('oldest','Oldest first')+sortOpt('historical','Historical first')+sortOpt('pending','Pending first')+
        '</select>'+
      '</div>'+
      '<div class="rep-row" style="font-size:10px;font-weight:600;color:var(--muted);border-bottom:2px solid var(--border);padding-bottom:4px">'+
        '<span style="flex:0 0 70px">'+t('det_date')+'</span><span style="flex:1">'+t('gig_desc')+'</span><span style="flex:0 0 90px">'+t('gig_payer')+'</span>'+
        '<span style="flex:0 0 60px;text-align:right">'+t('rep_col_gross')+'</span><span style="flex:0 0 55px;text-align:right">'+t('rep_col_hst')+'</span>'+
        '<span style="flex:0 0 50px;text-align:right">'+t('rep_col_dues')+'</span><span style="flex:0 0 60px;text-align:right">'+t('rep_col_taxset')+'</span>'+
      '</div>'+
      (freelanceRec.length ? rows : '<div style="color:var(--muted);font-size:13px;padding:12px 0">'+t('rep_no_freelance').replace('{year}',y)+'</div>')+
      '<div class="rep-row" style="font-weight:600;border-top:2px solid var(--border);margin-top:8px;padding-top:8px">'+
        '<span style="flex:1">'+t('rep_totals')+'</span>'+
        '<span style="flex:0 0 60px;text-align:right">'+fmt2(totalGross)+'</span>'+
        '<span style="flex:0 0 55px;text-align:right;color:var(--sage)">'+fmt2(totalHst)+'</span>'+
        '<span style="flex:0 0 50px;text-align:right;color:var(--muted)">'+fmt2(totalDues)+'</span>'+
        '<span style="flex:0 0 60px;text-align:right;color:var(--gold-d)">'+fmt2(totalTax)+'</span>'+
      '</div>';
    currentReportExport = {
      title: r.title+' — '+y, year: y, reportType: r.title,
      headers: [t('det_date'),t('gig_desc'),t('gig_payer'),t('rep_col_gross'),t('rep_col_hst'),t('rep_col_dues'),t('rep_col_taxset')],
      rows: freelanceRec.map(g=>[fmtD(g.date), g.name, g.payer||'', +((g.fee||0)+(g.cart||0)).toFixed(2), +(g.salesTax||0).toFixed(2), +(g.workDues||0).toFixed(2), +(g.incomeTax||0).toFixed(2)])
        .concat([[t('rep_totals'),'','', +totalGross.toFixed(2), +totalHst.toFixed(2), +totalDues.toFixed(2), +totalTax.toFixed(2)]]),
      numericCols: [3,4,5,6]
    };
  } else if(type==='audit'){
    // Checks every Received gig, all years, against the correct formula: gov money + savings buckets + enjoy (never work dues)
    const allRec = S.gigs.filter(g=>g.status==='Received');
    const withDelta = allRec.map(g=>{
      const correct = (g.incomeTax||0)+(g.salesTax||0)+(g.enjoy||0)+(g.buckets||[]).reduce((t,b)=>t+(b.amt||0),0);
      const stored = g.moveToHisa||0;
      return {g, correct, stored, delta: correct-stored};
    }).filter(x=>Math.abs(x.delta)>0.01);
    const totalDelta = withDelta.reduce((t,x)=>t+x.delta,0);
    const rows = withDelta.map(x=>`
      <div class="rep-row" style="font-size:12px;flex-wrap:wrap;gap:2px">
        <span style="flex:0 0 70px;color:var(--muted)">${fmtD(x.g.date)}</span>
        <span style="flex:1;min-width:100px">${x.g.name}${x.g.isHistorical?' <span style=\"color:var(--muted);font-size:10px\">'+t('audit_historical_tag')+'</span>':''}</span>
        <span style="flex:0 0 70px;text-align:right;color:var(--muted)">${fmt2(x.stored)}</span>
        <span style="flex:0 0 70px;text-align:right">${fmt2(x.correct)}</span>
        <span style="flex:0 0 70px;text-align:right;font-weight:600;color:${x.delta>0?'var(--gold-d)':'var(--red)'}">${x.delta>0?'+':''}${fmt2(x.delta)}</span>
      </div>`).join('');
    document.getElementById('rep-content').innerHTML =
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:8px">'+t('exp_all_years').replace('{year}',y)+'</div>'+
      (withDelta.length ? (
        '<div class="rep-row" style="font-size:10px;font-weight:600;color:var(--muted);border-bottom:2px solid var(--border);padding-bottom:4px">'+
          '<span style="flex:0 0 70px">'+t('det_date')+'</span><span style="flex:1">'+t('gig_desc')+'</span>'+
          '<span style="flex:0 0 70px;text-align:right">'+t('audit_col_stored')+'</span><span style="flex:0 0 70px;text-align:right">'+t('audit_col_correct')+'</span><span style="flex:0 0 70px;text-align:right">'+t('audit_col_diff')+'</span>'+
        '</div>'+rows+
        '<div class="rep-row" style="font-weight:600;border-top:2px solid var(--border);margin-top:8px;padding-top:8px">'+
          '<span style="flex:1">'+t('audit_total_short').replace('{account}',getSetAsideName())+'</span>'+
          '<span style="flex:0 0 70px;text-align:right;color:'+(totalDelta>0?'var(--gold-d)':'var(--red)')+'">'+(totalDelta>0?'+':'')+fmt2(totalDelta)+'</span>'+
        '</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-top:12px;line-height:1.5">'+t('audit_positive_note').replace(/\{account\}/g,getSetAsideName())+'</div>'
      ) : '<div style="color:var(--muted);font-size:13px;padding:12px 0">'+t('audit_no_discrepancies')+'</div>');
    currentReportExport = {
      title: r.title+' — '+y, year: y, reportType: r.title,
      headers: [t('det_date'),t('gig_desc'),t('audit_col_stored'),t('audit_col_correct'),t('audit_col_diff')],
      rows: withDelta.map(x=>[fmtD(x.g.date), x.g.name, +x.stored.toFixed(2), +x.correct.toFixed(2), +x.delta.toFixed(2)])
        .concat(withDelta.length ? [[t('rep_totals'),'','','', +totalDelta.toFixed(2)]] : []),
      numericCols: [2,3,4]
    };
  } else if(type==='goals'){
    const goalBuckets = S.buckets.filter(b=>(b.goalAmt||0)>0);
    if(!goalBuckets.length){
      document.getElementById('rep-content').innerHTML = '<div style="color:var(--muted);font-size:13px;padding:12px 0">'+t('goals_none_set')+'</div>';
      currentReportExport = null;
    } else {
      const locale = S.lang==='fr'?'fr-CA':S.lang==='es'?'es-ES':'en-CA';
      const exportRows = [];
      const rows = goalBuckets.map(b=>{
        const proj = computeGoalProjection(b);
        let projText, spentBtn='';
        if(proj.status==='reached'){
          projText=t('goals_reached');
          spentBtn='<button class="btn-outline" style="align-self:flex-start;padding:5px 12px;font-size:11px;margin-top:2px" onclick="markBucketSpent('+b.id+')">'+t('goals_mark_spent')+'</button>';
        }
        else if(proj.status==='projected'){
          projText=t('goals_projected').replace('{date}',proj.projDate.toLocaleDateString(locale,{month:'long',year:'numeric'}));
        } else { projText=t('goals_no_recent_pace'); }
        exportRows.push([b.name, +Math.max(0,proj.saved).toFixed(2), +b.goalAmt.toFixed(2), projText]);
        return '<div class="rep-row" style="flex-direction:column;align-items:stretch;gap:5px;padding:10px 0">'+
          '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:var(--sage-d)"><span>'+b.name+'</span><span>'+fmt(Math.max(0,proj.saved))+' / '+fmt(b.goalAmt)+'</span></div>'+
          '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+proj.pct+'%;background:var(--sage)"></div></div>'+
          '<div style="font-size:11px;color:var(--muted)">'+projText+'</div>'+spentBtn+
        '</div>';
      }).join('');
      document.getElementById('rep-content').innerHTML =
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:8px">'+t('goals_alltime_note')+'</div>'+rows;
      currentReportExport = { title: r.title+' — '+y, year: y, reportType: r.title, rawType: type, headers:[t('rep_export_goal'),t('rep_export_saved'),t('rep_export_target'),t('rep_export_status')], rows: exportRows, numericCols:[1,2] };
    }
  } else {
    document.getElementById('rep-content').innerHTML = r.rows.map(([l,v])=>'<div class="rep-row"><span>'+l+'</span><span>'+v+'</span></div>').join('');
    currentReportExport = { title: r.title+' — '+y, year: y, reportType: r.title, rawType: type, headers:[t('rep_export_field'),t('rep_export_value')], rows: r.rows.map(([l,v])=>[l,v]), numericCols: [] };
  }
  document.getElementById('rep-list').style.display='none';
  document.getElementById('rep-detail').style.display='block';
  renderReportExportButtons();
  track('report_viewed', type);
}
function renderReportExportButtons(){
  const lockIco = document.getElementById('rep-excel-lock-ico');
  const lockNote = document.getElementById('rep-excel-lock-note');
  const unlocked = isPremiumUnlocked();
  if(lockIco) lockIco.style.display = unlocked ? 'none' : 'inline';
  if(lockNote) lockNote.style.display = unlocked ? 'none' : 'block';
}
// ===== EXPORT (reports + invoice share these) =====
function downloadBlob(content, filename, mime){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}
function safeFilename(s){ return (s||'export').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'_'); }
// Shared filename convention for every export. Name comes from the invoice generator's
// "Your details" (the closest thing this app has to "who this belongs to"), falling back to a
// generic placeholder if it isn't set — applies to report filenames too, not just invoices.
function getExporterName(){
  const n = document.getElementById('inv-your-name')?.value.trim();
  return n || t('export_default_name');
}
function buildInvoiceFilenameBase(){
  const name = safeFilename(getExporterName());
  const date = document.getElementById('inv-date')?.value || new Date().toISOString().split('T')[0];
  return name+'_'+date+'_'+safeFilename(t('inv_title'));
}
function buildReportFilenameBase(){
  if(!currentReportExport) return 'export';
  const name = safeFilename(getExporterName());
  const year = currentReportExport.year || new Date().getFullYear();
  const reportType = safeFilename(currentReportExport.reportType || currentReportExport.title);
  return name+'_'+year+'_'+reportType;
}
// Opens a clean, minimal standalone document and triggers the browser's print dialog — the
// user picks "Save as PDF" there. No PDF library needed, and no server to render one on.
// filenameBase becomes the document <title>, which browsers use as the suggested save-as name.
function printHTML(filenameBase, bodyHTML, footerText){
  const win = window.open('', '_blank');
  if(!win){ alert(t('export_popup_blocked')); return; }
  const footer = '<div style="margin-top:24px;padding-top:10px;border-top:1px solid #ddd;font-size:10px;color:#9ca3af;text-align:center">'+footerText+'</div>';
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+filenameBase+'</title><style>'+
    'body{font-family:Arial,Helvetica,sans-serif;padding:28px;color:#1a1a1a;max-width:900px;margin:0 auto}'+
    'h1{font-size:19px;color:#2d4a3e;margin-bottom:14px}'+
    'table{width:100%;border-collapse:collapse;margin-top:8px}'+
    'th,td{border:1px solid #ddd;padding:7px 9px;text-align:left;font-size:12px}'+
    'th{background:#eef2f0;color:#2d4a3e;text-transform:uppercase;letter-spacing:.4px;font-size:10px}'+
    'tr:last-child td{font-weight:700;border-top:2px solid #2d4a3e}'+
    '@media print{body{padding:0}}'+
    '</style></head><body>'+bodyHTML+footer+'</body></html>');
  win.document.close();
  win.focus();
  setTimeout(()=>{ win.print(); }, 350);
}
function exportReportCSV(){
  if(!currentReportExport){ return; }
  const {headers, rows} = currentReportExport;
  const esc = v => { const s=String(v??''); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  // No branding footer here on purpose — a stray text row risks corrupting a clean re-import
  // into accounting software. CSV stays pure structured data; PDF and Excel carry the branding.
  const lines = [headers.map(esc).join(','), ...rows.map(row=>row.map(esc).join(','))];
  const BOM = String.fromCharCode(0xFEFF);
  downloadBlob(BOM+lines.join('\r\n'), buildReportFilenameBase()+'.csv', 'text/csv;charset=utf-8;');
  track('report_exported',{format:'csv',type:currentReportExport.rawType});
}
function exportReportPDF(){
  if(!currentReportExport){ return; }
  const {title, headers, rows} = currentReportExport;
  const table = '<table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(row=>'<tr>'+row.map(c=>'<td>'+(c===''||c==null?'—':c)+'</td>').join('')+'</tr>').join('')+
    '</tbody></table>';
  printHTML(buildReportFilenameBase(), '<h1>'+title+'</h1>'+table, t('export_footer_report'));
  track('report_exported',{format:'pdf',type:currentReportExport.rawType});
}
let _xlsxLoadPromise = null;
function ensureXLSX(){
  if(window.XLSX) return Promise.resolve();
  if(_xlsxLoadPromise) return _xlsxLoadPromise;
  _xlsxLoadPromise = new Promise((resolve,reject)=>{
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = resolve;
    s.onerror = ()=>{ _xlsxLoadPromise=null; reject(new Error('xlsx load failed')); };
    document.head.appendChild(s);
  });
  return _xlsxLoadPromise;
}
async function exportReportExcel(){
  if(!isPremiumUnlocked()){ track('premium_feature_blocked',{feature:'excel_export'}); return; }
  if(!currentReportExport) return;
  const {headers, rows, numericCols} = currentReportExport;
  try{ await ensureXLSX(); } catch(e){ alert(t('export_lib_failed')); return; }
  // Branding sits a couple of rows below the data table (not at the top, not in the tab name)
  // so it never interferes with the actual data or an accountant's formulas.
  const aoa = [headers, ...rows, [], [t('export_footer_report')]];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Column widths sized to content, real numeric cells (not text) with currency formatting on $ columns.
  ws['!cols'] = headers.map((h,i)=>({wch: Math.max(10, String(h).length+2, ...rows.map(row=>String(row[i]??'').length+2))}));
  // Autofilter covers only the header + data rows, not the branding line below it.
  ws['!autofilter'] = { ref: XLSX.utils.encode_range({s:{r:0,c:0},e:{r:rows.length,c:headers.length-1}}) };
  (numericCols||[]).forEach(col=>{
    for(let r=1;r<=rows.length;r++){
      const ref = XLSX.utils.encode_cell({r,c:col});
      if(ws[ref] && typeof ws[ref].v==='number') ws[ref].z = '#,##0.00';
    }
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, buildReportFilenameBase()+'.xlsx');
  track('report_exported',{format:'xlsx',type:currentReportExport.rawType});
}
function markBucketSpent(id){
  const b=S.buckets.find(x=>x.id===id); if(!b) return;
  const allTimeSaved=S.gigs.filter(g=>g.status==='Received').reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0);
  b.spentTotal=allTimeSaved;
  save();
  track('bucket_marked_spent');
  showRep('goals');
}
function hideRep(){ document.getElementById('rep-list').style.display='block'; document.getElementById('rep-detail').style.display='none'; }

// ===== YOUR PROGRESS (premium, gated behind isPremiumUnlocked()) =====
function monthYearLabel(year,month){
  const locale = S.lang==='fr'?'fr-CA':S.lang==='es'?'es-ES':'en-CA';
  return new Date(year,month,1).toLocaleDateString(locale,{month:'long',year:'numeric'});
}
// "N months" with correct per-language pluralization (French "mois" is invariant; Spanish "mes/meses" is irregular).
function monthsLabel(n){
  if(S.lang==='fr') return n+' mois';
  if(S.lang==='es') return n+' '+(n===1?'mes':'meses');
  return n+' month'+(n===1?'':'s');
}
// Builds one entry per calendar month from the user's first received gig through the current month
// (including months with zero gigs) — the basis for streaks and personal records. Uses the same
// "baseline covered" definition as the dashboard status pill: net income received that month >= baseline.
function getMonthlyHistory(){
  const rec = S.gigs.filter(g=>g.status==='Received');
  if(!rec.length) return [];
  const dates = rec.map(g=>new Date(g.date+'T12:00:00'));
  const minDate = new Date(Math.min(...dates));
  const now = new Date();
  const months = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  while(cursor<=end){
    const y=cursor.getFullYear(), m=cursor.getMonth();
    const mg = rec.filter(g=>{const d=new Date(g.date+'T12:00:00');return d.getFullYear()===y&&d.getMonth()===m;});
    const netIncome = mg.reduce((t,g)=>t+(g.netLiquid||0),0);
    months.push({
      year:y, month:m,
      netIncome,
      investedAmt: mg.reduce((t,g)=>t+(g.invest||0),0),
      baselineCovered: S.settings.baseline>0 && netIncome>=S.settings.baseline,
      gigs: mg
    });
    cursor.setMonth(cursor.getMonth()+1);
  }
  return months;
}
// Current (active) streaks plus the longest baseline streak ever achieved. Investment streak
// deliberately skips — never counts as a miss — any month where baseline wasn't covered.
function computeStreaks(){
  const months = getMonthlyHistory();
  if(!months.length) return null;
  const lastIdx = months.length-1;

  const baselinePaused = !months[lastIdx].baselineCovered;
  let baselineStreak=0;
  for(let i=lastIdx;i>=0;i--){ if(months[i].baselineCovered) baselineStreak++; else break; }
  let baselinePriorStreak=0;
  if(baselinePaused){
    for(let i=lastIdx-1;i>=0;i--){ if(months[i].baselineCovered) baselinePriorStreak++; else break; }
  }

  const coveredMonths = months.filter(m=>m.baselineCovered);
  let investStreak=0;
  for(let i=coveredMonths.length-1;i>=0;i--){ if(coveredMonths[i].investedAmt>0) investStreak++; else break; }
  const investPaused = coveredMonths.length>0 && coveredMonths[coveredMonths.length-1].investedAmt<=0;

  let longestBaselineStreakEver=0, cur=0;
  months.forEach(m=>{
    if(m.baselineCovered){ cur++; longestBaselineStreakEver=Math.max(longestBaselineStreakEver,cur); }
    else cur=0;
  });

  return {months, baselineStreak, baselinePaused, baselinePriorStreak, investStreak, investPaused, hasCoveredMonths:coveredMonths.length>0, longestBaselineStreakEver};
}
function computePersonalRecords(){
  const rec = S.gigs.filter(g=>g.status==='Received');
  const biggestGig = rec.reduce((best,g)=>(g.fee||0)>(best?.fee||0)?g:best, null);
  const months = getMonthlyHistory();
  const bestMonth = months.reduce((best,m)=>(m.netIncome>(best?.netIncome||0))?m:best, null);
  return {biggestGig, bestMonth};
}
// ADJUSTABLE: weighting for the lifetime Efficiency Score composite. Each sub-score is 0-100;
// change these weights (they're renormalized automatically, so they don't need to sum to 1) to
// tune emphasis. If no savings goals with a target are set, goalCompletion is dropped from the
// blend and the remaining weights are renormalized rather than penalizing a user with no goals.
const EFFICIENCY_WEIGHTS = { savingsRate:0.25, debtPayoff:0.25, selfLoanHealth:0.25, goalCompletion:0.25 };
function computeEfficiencyScore(){
  const rec = S.gigs.filter(g=>g.status==='Received');
  const totalNet = rec.reduce((t,g)=>t+(g.netLiquid||0),0);
  const totalSavedInvested = rec.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0);
  const savingsRateScore = totalNet>0 ? Math.min(100,totalSavedInvested/totalNet*100) : 0;

  // Debt-payoff progress: lifetime amount paid down vs. what's still owed right now. No debt
  // ever, none owing now = a perfect score (nothing to work off).
  const totalPaidDebt = rec.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0);
  const currentDebt = (S.debt?.cc||0)+(S.debt?.loan||0);
  const debtPayoffScore = (totalPaidDebt<=0 && currentDebt<=0) ? 100 : Math.min(100,(totalPaidDebt/(totalPaidDebt+currentDebt))*100);

  // Self-loan health: same progress-based method as debt — lifetime repaid vs. lifetime borrowed
  // from yourself. Never borrowed = a perfect score.
  const totalBorrowedSelf = rec.reduce((t,g)=>t+(g.selfLoanBorrow||0),0);
  const totalRepaidSelf = rec.reduce((t,g)=>t+(g.selfLoanRepay||0),0);
  const selfLoanScore = totalBorrowedSelf<=0 ? 100 : Math.min(100,(totalRepaidSelf/totalBorrowedSelf)*100);

  const goalBuckets = S.buckets.filter(b=>(b.goalAmt||0)>0);
  let goalScore=null;
  if(goalBuckets.length){
    const progresses = goalBuckets.map(b=>{
      const saved = rec.reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0)-(b.spentTotal||0);
      return Math.min(100,Math.max(0,saved/b.goalAmt*100));
    });
    goalScore = progresses.reduce((a,b)=>a+b,0)/progresses.length;
  }

  const parts = [
    {score:savingsRateScore, weight:EFFICIENCY_WEIGHTS.savingsRate},
    {score:debtPayoffScore, weight:EFFICIENCY_WEIGHTS.debtPayoff},
    {score:selfLoanScore, weight:EFFICIENCY_WEIGHTS.selfLoanHealth}
  ];
  if(goalScore!==null) parts.push({score:goalScore, weight:EFFICIENCY_WEIGHTS.goalCompletion});
  const totalWeight = parts.reduce((t,p)=>t+p.weight,0);
  const composite = totalWeight>0 ? parts.reduce((t,p)=>t+p.score*p.weight,0)/totalWeight : 0;
  return {composite:Math.round(composite), savingsRateScore, debtPayoffScore, selfLoanScore, goalScore};
}
// Reusable circular gauge — the standard "gauge/dial" visual for this app going forward.
function gaugeSVG(score, opts){
  opts = opts||{};
  const size = opts.size||140, stroke = opts.stroke||12;
  const max = opts.max||100;
  const r = (size-stroke)/2;
  const circumference = 2*Math.PI*r;
  const clamped = Math.max(0,Math.min(max,score));
  const dash = circumference*(clamped/max);
  const isPeak = clamped>=max;
  const color = isPeak?'var(--green)':clamped>=max*0.75?'var(--sage)':clamped>=max*0.5?'var(--gold)':'var(--amber)';
  const showMax = opts.showMax!==false;
  const numY = size/2 + (showMax ? -Math.round(size*0.04) : Math.round(size*0.07));
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" role="img" aria-label="'+(opts.ariaLabel||('Score '+clamped+' out of '+max))+'">'+
    '<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="var(--sage-l)" stroke-width="'+stroke+'"/>'+
    '<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+stroke+'" stroke-linecap="round" stroke-dasharray="'+dash+' '+circumference+'" transform="rotate(-90 '+(size/2)+' '+(size/2)+')" style="transition:stroke-dasharray .6s ease"/>'+
    '<text x="'+(size/2)+'" y="'+numY+'" text-anchor="middle" font-size="'+Math.round(size*0.22)+'" font-weight="700" fill="var(--sage-d)" font-family="Inter, sans-serif">'+clamped+'</text>'+
    (showMax ? '<text x="'+(size/2)+'" y="'+(numY+Math.round(size*0.14))+'" text-anchor="middle" font-size="'+Math.round(size*0.11)+'" fill="var(--muted)" font-family="Inter, sans-serif">/ '+max+'</text>' : '')+
  '</svg>';
}
// Dashboard entry point — always visible. Shows the real card when unlocked, a blurred/locked
// teaser when not (never fully hidden), per Part C spec. Called from updateDash() and whenever
// the dev premium toggle changes.
function renderProgressCard(){
  const el = document.getElementById('progress-card-section'); if(!el) return;
  if(isPremiumUnlocked()){
    el.innerHTML = '<button class="rep-card" onclick="showPage(\'progress\')" style="margin:0 14px 14px;width:calc(100% - 28px)" aria-label="Your Progress">'+
      '<div class="rep-ico" style="background:var(--gold)"><i class="ti ti-chart-arcs-3" aria-hidden="true"></i></div>'+
      '<div class="rep-info"><h3>'+t('progress_card_title')+'</h3><p>'+t('progress_card_sub')+'</p></div>'+
      '<i class="ti ti-chevron-right" style="color:var(--muted);margin-left:auto" aria-hidden="true"></i>'+
    '</button>';
  } else {
    el.innerHTML =
      '<div style="margin:0 14px 6px;position:relative;border-radius:var(--r);overflow:hidden" onclick="track(\'premium_feature_blocked\',{feature:\'progress_screen\'})">'+
        '<div style="filter:blur(4px);opacity:.55;pointer-events:none;display:flex;align-items:center;gap:12px;padding:13px 15px;background:var(--sage-l);border-radius:var(--r)">'+
          '<div class="rep-ico" style="background:var(--gold)"><i class="ti ti-chart-arcs-3" aria-hidden="true"></i></div>'+
          '<div class="rep-info"><h3>'+t('progress_card_title')+'</h3><p>'+t('progress_card_sub')+'</p></div>'+
        '</div>'+
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center" aria-hidden="true"><i class="ti ti-lock" style="font-size:20px;color:var(--sage-d)"></i></div>'+
      '</div>'+
      '<p style="font-size:11px;color:var(--muted);margin:0 14px 14px;text-align:center">'+t('progress_locked_caption')+'</p>';
  }
}
function renderProgressScreen(){
  const el = document.getElementById('progress-content'); if(!el) return;
  if(!isPremiumUnlocked()){
    el.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;line-height:1.6">'+t('progress_locked_screen_msg1')+'<br>'+t('progress_locked_screen_msg2')+'</div>';
    return;
  }
  const eff = computeEfficiencyScore();
  const streaks = computeStreaks();
  const records = computePersonalRecords();
  const goalBuckets = S.buckets.filter(b=>(b.goalAmt||0)>0);
  const locale = S.lang==='fr'?'fr-CA':S.lang==='es'?'es-ES':'en-CA';

  const isPeakEfficiency = eff.composite>=100;
  let html = '<div class="card" style="text-align:center;padding:22px 15px">'+
    '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);margin-bottom:10px">'+t('progress_eff_label')+'</div>'+
    gaugeSVG(eff.composite,{size:150,stroke:14,ariaLabel:'Efficiency score '+eff.composite+' out of 100'})+
    (isPeakEfficiency ? '<div style="margin-top:12px;background:var(--green-l);border-radius:var(--rs);padding:9px 12px;color:var(--green);font-weight:600;font-size:13px">'+t('progress_peak_efficiency')+'</div>' : '')+
    '<p style="font-size:12px;color:var(--muted);margin-top:12px;line-height:1.5">'+t('progress_eff_caption')+'</p>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="sec-label" style="padding:0 0 10px">'+t('progress_streaks_label')+'</div>';
  if(!streaks){
    html += '<p style="font-size:13px;color:var(--muted)">'+t('progress_streaks_empty')+'</p>';
  } else {
    if(streaks.baselinePaused){
      html += streaks.baselinePriorStreak>0
        ? '<div style="background:var(--gold-l);border-radius:var(--rs);padding:10px 12px;margin-bottom:10px;font-size:13px;color:var(--gold-d);line-height:1.5">'+t('progress_baseline_paused').replace('{months}',monthsLabel(streaks.baselinePriorStreak))+'</div>'
        : '<div style="background:var(--gold-l);border-radius:var(--rs);padding:10px 12px;margin-bottom:10px;font-size:13px;color:var(--gold-d);line-height:1.5">'+t('progress_baseline_none_yet')+'</div>';
    } else {
      html += '<div class="det-row"><span>'+t('dash_baseline_covered')+'</span><span style="font-weight:600;color:var(--sage-d)">'+t('progress_streak_in_a_row').replace('{months}',monthsLabel(streaks.baselineStreak))+'</span></div>';
    }
    if(!streaks.hasCoveredMonths){
      html += '<p style="font-size:12px;color:var(--muted);margin-top:6px">'+t('progress_invest_no_covered_yet')+'</p>';
    } else if(streaks.investPaused){
      html += '<div style="font-size:13px;color:var(--muted);margin-top:6px">'+t('progress_invest_paused')+'</div>';
    } else {
      html += '<div class="det-row"><span>'+t('progress_invest_label')+'</span><span style="font-weight:600;color:var(--sage-d)">'+t('progress_streak_in_a_row').replace('{months}',monthsLabel(streaks.investStreak))+'</span></div>';
    }
  }
  html += '</div>';

  html += '<div class="card">'+
    '<div class="sec-label" style="padding:0 0 10px">'+t('progress_records_label')+'</div>'+
    '<div class="det-row"><span>'+t('progress_biggest_gig_label')+'</span><span>'+(records.biggestGig?fmt2(records.biggestGig.fee)+' — '+records.biggestGig.name:'—')+'</span></div>'+
    '<div class="det-row"><span>'+t('progress_best_month_label')+'</span><span>'+(records.bestMonth?fmt(records.bestMonth.netIncome)+' — '+monthYearLabel(records.bestMonth.year,records.bestMonth.month):'—')+'</span></div>'+
    '<div class="det-row"><span>'+t('progress_longest_streak_label')+'</span><span>'+monthsLabel(streaks?streaks.longestBaselineStreakEver:0)+'</span></div>'+
  '</div>';

  html += '<div class="card" style="padding-bottom:16px">'+
    '<div class="sec-label" style="padding:0 0 10px">'+t('progress_timetogoal_label')+'</div>'+
    (goalBuckets.length ? goalBuckets.map(b=>{
      const proj = computeGoalProjection(b);
      let projText;
      if(proj.status==='reached') projText=t('goals_reached');
      else if(proj.status==='projected') projText=t('goals_projected').replace('{date}',proj.projDate.toLocaleDateString(locale,{month:'long',year:'numeric'}));
      else projText=t('goals_no_recent_pace');
      return '<div class="rep-row" style="flex-direction:column;align-items:stretch;gap:5px;padding:10px 0">'+
        '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:var(--sage-d)"><span>'+b.name+'</span><span>'+fmt(Math.max(0,proj.saved))+' / '+fmt(b.goalAmt)+'</span></div>'+
        '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+proj.pct+'%;background:var(--sage)"></div></div>'+
        '<div style="font-size:11px;color:var(--muted)">'+projText+'</div>'+
      '</div>';
    }).join('') : '<p style="font-size:13px;color:var(--muted)">'+t('progress_no_goals_msg')+'</p>')+
  '</div>';

  el.innerHTML = html;
  track('screen_view','progress');
}

// ===== INVOICE GENERATOR =====
let invLines=[{id:1,mode:'flat',desc:'',amt:0,hours:0,rate:0}];
let invAdjustments=[];
function initInvoice(){
  const today=new Date();
  const dateStr=today.toISOString().split('T')[0];
  const due=new Date(today);due.setDate(due.getDate()+30);
  const dueStr=due.toISOString().split('T')[0];
  document.getElementById('inv-date').value=dateStr;
  document.getElementById('inv-due').value=dueStr;
  const invCount=S.gigs.length+1;
  document.getElementById('inv-num').value='INV-'+String(invCount).padStart(3,'0');
  renderInvLines();
  renderInvAdjustments();
  renderInvLogoSection();
}
// ===== INVOICE LOGO (premium) =====
function renderInvLogoSection(){
  const el = document.getElementById('inv-logo-section'); if(!el) return;
  if(!isPremiumUnlocked()){
    el.innerHTML =
      '<div style="position:relative;border-radius:var(--rs);overflow:hidden">'+
        '<div style="filter:blur(3px);opacity:.55;pointer-events:none;background:var(--sage-l);border-radius:var(--rs);padding:14px;display:flex;align-items:center;gap:10px">'+
          '<i class="ti ti-photo" style="font-size:22px;color:var(--sage-d)" aria-hidden="true"></i>'+
          '<span style="font-size:13px;color:var(--muted)">'+t('inv_logo_upload')+'</span>'+
        '</div>'+
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center" aria-hidden="true"><i class="ti ti-lock" style="font-size:18px;color:var(--sage-d)"></i></div>'+
      '</div>'+
      '<p style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px">'+t('progress_locked_caption')+'</p>';
    return;
  }
  if(S.invoiceLogo){
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;background:var(--sage-l);border-radius:var(--rs);padding:10px 12px;margin-bottom:8px">'+
        '<img src="'+S.invoiceLogo+'" alt="Logo" style="max-height:50px;max-width:120px;border-radius:4px;background:white;padding:4px;object-fit:contain">'+
        '<div style="display:flex;flex-direction:column;gap:6px">'+
          '<button class="btn-outline" style="margin:0;width:auto;padding:7px 11px;font-size:12px" onclick="document.getElementById(\'inv-logo-file\').click()">'+t('inv_logo_replace')+'</button>'+
          '<button class="btn-outline" style="margin:0;width:auto;padding:7px 11px;font-size:12px;color:var(--red);border-color:var(--red)" onclick="removeInvoiceLogo()">'+t('inv_logo_remove')+'</button>'+
        '</div>'+
      '</div>'+
      '<input type="file" id="inv-logo-file" accept="image/png,image/jpeg" style="display:none" onchange="handleInvoiceLogoUpload(this)">';
  } else {
    el.innerHTML =
      '<input type="file" id="inv-logo-file" accept="image/png,image/jpeg" style="display:none" onchange="handleInvoiceLogoUpload(this)">'+
      '<button class="btn-outline" style="margin:0" onclick="document.getElementById(\'inv-logo-file\').click()"><i class="ti ti-upload" style="vertical-align:-2px;margin-right:4px" aria-hidden="true"></i>'+t('inv_logo_upload')+'</button>'+
      '<p style="font-size:11px;color:var(--muted);margin-top:6px">'+t('inv_logo_hint')+'</p>';
  }
}
function handleInvoiceLogoUpload(input){
  const file = input.files && input.files[0];
  if(!file) return;
  if(!/^image\/(png|jpeg)$/.test(file.type)){
    alert(t('inv_logo_bad_type'));
    input.value='';
    return;
  }
  const MAX_LOGO_BYTES = 5*1024*1024;
  if(file.size > MAX_LOGO_BYTES){
    alert(t('inv_logo_too_large'));
    input.value='';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      const maxW = 300;
      const scale = Math.min(1, maxW/img.width);
      const w = Math.max(1, Math.round(img.width*scale));
      const h = Math.max(1, Math.round(img.height*scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // Preserve transparency for PNG logos; compress photographic JPEGs.
      S.invoiceLogo = file.type==='image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85);
      save();
      renderInvLogoSection();
      track('invoice_logo_uploaded');
    };
    img.onerror = function(){ alert(t('inv_logo_bad_type')); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  input.value='';
}
function removeInvoiceLogo(){
  S.invoiceLogo = null;
  save();
  renderInvLogoSection();
  track('invoice_logo_removed');
}
function renderInvLines(){
  const el=document.getElementById('inv-lines');if(!el)return;
  el.innerHTML=invLines.map(l=>`
    <div style="border:1.5px solid var(--border);border-radius:var(--rs);padding:10px;margin-bottom:8px">
      <div style="display:flex;gap:7px;margin-bottom:${l.mode==='hourly'?'7px':'0'}">
        <input type="text" value="${l.desc}" placeholder="${t('inv_line_desc_ph')}" style="flex:1;padding:10px 11px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:14px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'desc',this.value)" aria-label="Line item description">
        <select onchange="updInvLine(${l.id},'mode',this.value)" style="width:82px;padding:10px 6px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;font-family:var(--font)" aria-label="Line item type">
          <option value="flat" ${l.mode==='hourly'?'':'selected'}>${t('inv_mode_flat')}</option>
          <option value="hourly" ${l.mode==='hourly'?'selected':''}>${t('inv_mode_hourly')}</option>
        </select>
        ${invLines.length>1?`<button onclick="delInvLine(${l.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px" aria-label="Remove line"><i class="ti ti-x" aria-hidden="true"></i></button>`:''}
      </div>
      ${l.mode==='hourly'?`
      <div style="display:flex;gap:7px;align-items:center">
        <input type="number" value="${l.hours||''}" placeholder="${t('inv_hours_ph')}" style="flex:1;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'hours',this.value)" aria-label="Hours">
        <span style="color:var(--muted);font-size:13px">×</span>
        <input type="number" value="${l.rate||''}" placeholder="${t('inv_rate_ph')}" style="flex:1;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'rate',this.value)" aria-label="Rate per hour">
        <span style="color:var(--muted);font-size:13px">=</span>
        <span style="font-weight:600;color:var(--sage-d);font-size:13px;min-width:60px;text-align:right">${fmt2((l.hours||0)*(l.rate||0))}</span>
      </div>`:`
      <input type="number" value="${l.amt||''}" placeholder="${t('inv_amount_ph')}" style="width:100%;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'amt',this.value)" aria-label="Amount">`}
    </div>`).join('');
}
// Once a preview has been generated, keep it in sync live — editing a line item or adjustment
// without this would leave a stale total on screen until the user remembers to re-click Preview.
function invPreviewVisible(){
  const el = document.getElementById('inv-preview-section');
  return !!el && el.style.display !== 'none';
}
function maybeRefreshInvPreview(){
  if(invPreviewVisible()) previewInvoice(true);
}
function addInvLine(){invLines.push({id:Date.now(),mode:'flat',desc:'',amt:0,hours:0,rate:0});renderInvLines();maybeRefreshInvPreview();}
function delInvLine(id){if(invLines.length>1){invLines=invLines.filter(l=>l.id!==id);renderInvLines();maybeRefreshInvPreview();}}
function updInvLine(id,field,val){
  const l=invLines.find(x=>x.id===id);if(!l)return;
  if(field==='desc'||field==='mode') l[field]=val;
  else l[field]=parseFloat(val)||0;
  if(l.mode==='hourly') l.amt=(l.hours||0)*(l.rate||0);
  renderInvLines();
  maybeRefreshInvPreview();
}

function renderInvAdjustments(){
  const el=document.getElementById('inv-adjustments');if(!el)return;
  el.innerHTML = invAdjustments.length ? invAdjustments.map(a=>`
    <div style="border:1.5px solid var(--border);border-radius:var(--rs);padding:10px;margin-bottom:8px">
      <div style="display:flex;gap:7px;margin-bottom:7px">
        <input type="text" value="${a.label}" placeholder="${t('inv_adj_label_ph')}" onchange="updInvAdjustment(${a.id},'label',this.value)" style="flex:1;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font);outline:none" aria-label="Adjustment label">
        <button onclick="delInvAdjustment(${a.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px" aria-label="Remove adjustment"><i class="ti ti-x" aria-hidden="true"></i></button>
      </div>
      <input type="text" value="${a.refNote}" placeholder="${t('inv_adj_refnote_ph')}" onchange="updInvAdjustment(${a.id},'refNote',this.value)" style="width:100%;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;font-family:var(--font);outline:none;margin-bottom:7px" aria-label="Reference note">
      <div style="display:flex;gap:7px">
        <select onchange="updInvAdjustment(${a.id},'type',this.value)" style="flex:1;padding:9px 6px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;font-family:var(--font)" aria-label="Adjustment type">
          <option value="pct" ${a.type==='flat'?'':'selected'}>%</option>
          <option value="flat" ${a.type==='flat'?'selected':''}>${t('inv_adj_type_flat')}</option>
        </select>
        <input type="number" value="${a.value||''}" placeholder="0" onchange="updInvAdjustment(${a.id},'value',this.value)" style="flex:1;padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;font-family:var(--font)" aria-label="Adjustment value">
        <select onchange="updInvAdjustment(${a.id},'direction',this.value)" style="flex:1.3;padding:9px 4px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;font-family:var(--font)" aria-label="Add or subtract">
          <option value="add" ${a.direction==='subtract'?'':'selected'}>${t('inv_adj_dir_add')}</option>
          <option value="subtract" ${a.direction==='subtract'?'selected':''}>${t('inv_adj_dir_subtract')}</option>
        </select>
      </div>
    </div>`).join('')
    : '<p style="font-size:12px;color:var(--muted);padding:0 0 10px">'+t('inv_adj_empty_note')+'</p>';
}
function addInvAdjustment(){invAdjustments.push({id:Date.now(),label:'',refNote:'',type:'pct',value:0,direction:'add'});renderInvAdjustments();maybeRefreshInvPreview();}
function delInvAdjustment(id){invAdjustments=invAdjustments.filter(a=>a.id!==id);renderInvAdjustments();maybeRefreshInvPreview();}
function updInvAdjustment(id,field,val){
  const a=invAdjustments.find(x=>x.id===id);if(!a)return;
  if(field==='value') a.value=parseFloat(val)||0;
  else a[field]=val;
  maybeRefreshInvPreview();
}

function previewInvoice(auto){
  const yourName=document.getElementById('inv-your-name').value.trim()||t('inv_your_name_ph');
  const yourAddr=document.getElementById('inv-your-addr').value.trim();
  const yourEmail=document.getElementById('inv-your-email').value.trim();
  const yourPhone=document.getElementById('inv-your-phone').value.trim();
  const clientName=document.getElementById('inv-client-name').value.trim()||t('inv_client_name_ph');
  const clientAddr=document.getElementById('inv-client-addr').value.trim();
  const invNum=document.getElementById('inv-num').value.trim()||t('inv_num_ph');
  const invDate=document.getElementById('inv-date').value;
  const invDue=document.getElementById('inv-due').value;
  const payNote=document.getElementById('inv-payment-note').value.trim();
  const subtotal=invLines.reduce((t,l)=>t+(+l.amt||0),0);
  // Each adjustment (premium, sales tax, dues, discount, etc.) is computed independently from the
  // Subtotal — not compounded on top of prior adjustments — then all are summed onto the Subtotal.
  // This matches how the app's own gig calculator treats sales tax and dues (both independent
  // percentages of the same base amount), and keeps the total predictable regardless of list order.
  const adjRows = invAdjustments.filter(a=>(a.label||'').trim()||a.value).map(a=>{
    const rawAmt = a.type==='pct' ? subtotal*((+a.value||0)/100) : (+a.value||0);
    const signedAmt = a.direction==='subtract' ? -rawAmt : rawAmt;
    const sign = a.direction==='subtract' ? '-' : '';
    const valueText = a.type==='pct' ? sign+(+a.value||0)+'%' : sign+fmt2(Math.abs(+a.value||0));
    const label = ((a.label||'').trim()||t('inv_adjustment_default')) + ' ' + valueText + ((a.refNote||'').trim()?' ('+a.refNote.trim()+')':'');
    return {label, amt:signedAmt};
  });
  const total = subtotal + adjRows.reduce((t,r)=>t+r.amt,0);

  const logoHTML = (S.invoiceLogo && isPremiumUnlocked())
    ? '<div style="margin-bottom:14px"><img src="'+S.invoiceLogo+'" alt="Logo" style="max-width:160px;max-height:70px;object-fit:contain;display:block"></div>'
    : '';
  document.getElementById('inv-preview').innerHTML=`
    ${logoHTML}
    <div class="inv-hdr">
      <div>
        <div style="font-size:20px;font-weight:700;color:var(--sage-d)">${yourName}</div>
        ${yourAddr?'<div style="font-size:12px;color:var(--muted);margin-top:2px">'+yourAddr.replace(/\n/g,'<br>')+'</div>':''}
        ${yourEmail?'<div style="font-size:12px;color:var(--muted)">'+yourEmail+'</div>':''}
        ${yourPhone?'<div style="font-size:12px;color:var(--muted)">'+yourPhone+'</div>':''}
      </div>
      <div class="inv-meta">
        <h2>${t('inv_title')}</h2>
        <p>${t('inv_num_prefix').replace('{num}',invNum)}</p>
        <p>${t('inv_date_prefix').replace('{date}',invDate?fmtFull(invDate):'')}</p>
        <p>${t('inv_due_prefix').replace('{date}',invDue?fmtFull(invDue):'')}</p>
      </div>
    </div>
    <div class="inv-parties">
      <div class="inv-party">
        <h4>${t('inv_from')}</h4>
        <p><strong>${yourName}</strong><br>${yourAddr.replace(/\n/g,'<br>')}${yourEmail?'<br>'+yourEmail:''}${yourPhone?'<br>'+yourPhone:''}</p>
      </div>
      <div class="inv-party">
        <h4>${t('inv_billto')}</h4>
        <p><strong>${clientName}</strong><br>${clientAddr.replace(/\n/g,'<br>')}</p>
      </div>
    </div>
    <table class="inv-table">
      <thead><tr><th>${t('gig_desc')}</th><th>${t('inv_col_amt')}</th></tr></thead>
      <tbody>${invLines.filter(l=>l.desc||l.amt||l.hours||l.rate).map(l=>{
        const desc = l.mode==='hourly'
          ? (l.desc||'—')+' <span style="color:var(--muted);font-size:11px">('+(l.hours||0)+' hrs × '+fmt2(l.rate||0)+'/hr)</span>'
          : (l.desc||'—');
        return `<tr><td>${desc}</td><td>${fmt2(+l.amt||0)}</td></tr>`;
      }).join('')}</tbody>
    </table>
    <div class="inv-totals">
      <div class="inv-total-row"><span>${t('inv_subtotal')}</span><span>${fmt2(subtotal)}</span></div>
      ${adjRows.map(r=>`<div class="inv-total-row"><span>${r.label}</span><span>${r.amt<0?'-':''}${fmt2(Math.abs(r.amt))}</span></div>`).join('')}
      <div class="inv-total-row total"><span>${t('inv_total')}</span><span>${fmt2(total)}</span></div>
    </div>
    ${payNote?`<div class="inv-note"><strong>${t('inv_payment_prefix')}</strong> ${payNote}</div>`:''}
  `;
  document.getElementById('inv-preview-section').style.display='block';
  if(!auto){
    document.getElementById('inv-preview-section').scrollIntoView({behavior:'smooth'});
    track('invoice_generated');
  }
}
function exportInvoicePDF(){
  const preview = document.getElementById('inv-preview');
  if(!preview || !preview.innerHTML.trim()) return;
  printHTML(buildInvoiceFilenameBase(), '<div class="invoice-preview">'+preview.innerHTML+'</div><style>'+
    '.invoice-preview{font-size:13px}'+
    '.inv-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #4a665b}'+
    '.inv-meta{text-align:right}.inv-meta h2{font-size:18px;font-weight:700;color:#2d4a3e;letter-spacing:1px;text-transform:uppercase}.inv-meta p{font-size:12px;color:#6b7280;margin-top:2px}'+
    '.inv-parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}'+
    '.inv-party h4{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-bottom:4px}.inv-party p{font-size:12px;line-height:1.5}'+
    '.inv-table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:12px}'+
    '.inv-table th{text-align:left;padding:6px 8px;background:#eef2f0;color:#2d4a3e;font-size:10px;text-transform:uppercase;letter-spacing:.5px}'+
    '.inv-table th:last-child,.inv-table td:last-child{text-align:right}'+
    '.inv-table td{padding:8px;border-bottom:1px solid rgba(74,102,91,.13)}'+
    '.inv-totals{text-align:right;margin-bottom:12px}.inv-total-row{display:flex;justify-content:flex-end;gap:40px;padding:3px 0;font-size:13px}'+
    '.inv-total-row.total{font-weight:700;font-size:15px;color:#2d4a3e;padding-top:6px;border-top:1.5px solid #2d4a3e;margin-top:4px}'+
    '.inv-note{background:#eef2f0;border-radius:8px;padding:10px 12px;font-size:11px;color:#2d4a3e;margin-top:12px}'+
    '</style>', t('export_footer_invoice'));
  track('invoice_exported');
}

// ===== PREMIUM GATING =====
// Single source of truth for whether premium features are unlocked. Backed by the real per-account
// premium_access field fetched from Supabase (see fetchPremiumAccess()), refreshed at login — not
// anything a user can set themselves. Every premium-gated feature calls this function rather than
// checking state directly, so this one place is the only thing that ever needed to change when the
// old local dev toggle was replaced with a real account-based entitlement.
function isPremiumUnlocked(){
  return premiumAccess === true;
}

// ===== SETTINGS =====
function renderSettings(){
  const acctEmailEl = document.getElementById('set-account-email');
  if(acctEmailEl) acctEmailEl.textContent = getCurrentUser()?.email || '—';
  ['set-new-password','set-confirm-password'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  ['set-pw-err','set-pw-msg'].forEach(id => { const el = document.getElementById(id); if(el) el.style.display='none'; });
  const langNames={en:'English',es:'Español',fr:'Français'};
  document.getElementById('set-lang').textContent=langNames[S.lang]||'English';
  document.getElementById('set-base').textContent=fmt(S.settings.baseline);
  document.getElementById('set-currency').textContent=S.currency||'$';
  document.getElementById('set-tax').textContent=Math.round(S.settings.taxRate*100)+'%';
  document.getElementById('set-hst').textContent=Math.round(S.settings.hstRate*100)+'%';
  // Populate account name fields
  const an = S.acctNames||{};
  const chk=document.getElementById('acct-chequing'); if(chk) chk.value=an.chequing||'';
  const sa=document.getElementById('acct-setaside'); if(sa) sa.value=an.setaside||'';
  const inv=document.getElementById('acct-invest'); if(inv) inv.value=an.invest||'';
  // CPP folded into tax set-aside
  document.getElementById('learn-tog').checked=S.learnMode!==false;
  document.getElementById('carry-tog').checked=!!S.toggleCarry;
  const el=document.getElementById('set-bkts');
  el.innerHTML=S.buckets.length
    ?S.buckets.map(b=>`<div class="set-row"><span class="set-label">${b.name}</span><span class="set-val">${b.pct}%</span></div>`).join('')+
      `<div class="set-row"><span class="set-label">Enjoy-life</span><span class="set-val">${Math.round(S.settings.enjoyPct*100)}%</span></div>`
    :'<p style="font-size:13px;color:var(--muted);padding:8px 0">No savings buckets set up yet.</p>';
  // Populate balance/debt/self-loan inputs
  if(document.getElementById('bal-chk')) document.getElementById('bal-chk').value=S.balances?.checking||'';
  if(document.getElementById('bal-sav')) document.getElementById('bal-sav').value=S.balances?.savings||'';
  if(document.getElementById('bal-tfsa')) document.getElementById('bal-tfsa').value=S.balances?.tfsa||'';
  if(document.getElementById('bal-inv')) document.getElementById('bal-inv').value=S.balances?.invest||'';
  if(document.getElementById('debt-cc')) document.getElementById('debt-cc').value=S.debt?.cc||'';
  if(document.getElementById('debt-loan')) document.getElementById('debt-loan').value=S.debt?.loan||'';
  if(document.getElementById('set-selfloan')) document.getElementById('set-selfloan').textContent=fmt(S.selfLoan||0);
}
function addSelfLoanLump(){
  const amt=parseFloat(document.getElementById('selfloan-add').value)||0;
  if(amt<=0) return;
  S.selfLoan=(S.selfLoan||0)+amt;
  document.getElementById('selfloan-add').value='';
  save(); renderSettings();
}
function dismissReadiness(){
  S.hasSeenReadinessCheck = true;
  save();
  closeOv('readiness-modal');
  track('readiness_check_dismissed',{via:'acknowledged'});
}
// Dismissing via the backdrop instead of the acknowledge button is a distinct signal — separate
// from the generic closeOvIf() used by other modals so it doesn't fire there too.
function closeReadinessBackdrop(e){
  if(e.target !== document.getElementById('readiness-modal')) return;
  track('readiness_check_dismissed',{via:'backdrop'});
  closeOv('readiness-modal');
}
function getAcctName(type, fallback){
  const n = S.acctNames?.[type];
  return (n && n.trim()) ? n.trim() : fallback;
}
function getSetAsideName(){ return getAcctName('setaside',t('default_setaside_name')); }
function getInvestName(){ return getAcctName('invest',t('default_invest_name')); }
function getChequingName(){ return getAcctName('chequing',t('default_chequing_name')); }
function saveAcctNames(){
  S.acctNames = {
    chequing: document.getElementById('acct-chequing')?.value.trim()||'',
    setaside: document.getElementById('acct-setaside')?.value.trim()||'',
    invest: document.getElementById('acct-invest')?.value.trim()||''
  };
  save();
}
function openBalanceOverride(){
  document.getElementById('bo-selfloan').value=(S.selfLoan||0).toFixed(2);
  document.getElementById('bo-cc').value=(S.debt?.cc||0).toFixed(2);
  document.getElementById('bo-loan').value=(S.debt?.loan||0).toFixed(2);
  openOv('balance-override-modal');
}
function saveBalanceOverride(){
  S.selfLoan=parseFloat(document.getElementById('bo-selfloan').value)||0;
  if(!S.debt) S.debt={cc:0,loan:0};
  S.debt.cc=parseFloat(document.getElementById('bo-cc').value)||0;
  S.debt.loan=parseFloat(document.getElementById('bo-loan').value)||0;
  save(); closeOv('balance-override-modal'); renderSettings(); updateDash();
  track('balance_override_saved');
}
function saveBalances(){
  S.balances={
    checking:parseFloat(document.getElementById('bal-chk')?.value)||0,
    savings:parseFloat(document.getElementById('bal-sav')?.value)||0,
    tfsa:parseFloat(document.getElementById('bal-tfsa')?.value)||0,
    invest:parseFloat(document.getElementById('bal-inv')?.value)||0
  };
  S.debt={
    cc:parseFloat(document.getElementById('debt-cc')?.value)||0,
    loan:parseFloat(document.getElementById('debt-loan')?.value)||0
  };
  save(); if(S.onboarded) updateDash();
}
function saveS(){
  const prevLearn=S.learnMode;
  S.learnMode=document.getElementById('learn-tog').checked;
  const learnNote=document.getElementById('ob3-learn-note');
  if(learnNote)learnNote.style.display=S.learnMode?'block':'none';
  S.toggleCarry=document.getElementById('carry-tog').checked;
  if(S.learnMode!==prevLearn)track('learn_mode_changed',{on:S.learnMode});
  applyLearnMode();
  save();
  if(S.learnMode===false) checkAutoTips();
}
function applyLearnMode(){
  const on = S.learnMode!==false;
  // Show/hide all educational tip elements
  document.querySelectorAll('.learn-tip,.hisa-tip,.edu-note').forEach(el=>{
    el.style.display = on ? 'block' : 'none';
  });
  // Show/hide How It Works educational note blocks
  document.querySelectorAll('.help-term p').forEach(el=>{
    el.style.display = on ? '' : 'none';
  });
  // HISA modal tip
  const hmtip = document.getElementById('hm-tip');
  if(hmtip) hmtip.style.display = on ? 'block' : 'none';
  // Self-loan explanation
  const slTip = document.getElementById('sl-tip');
  if(slTip) slTip.style.display = on ? 'block' : 'none';
}

// Edit expense modal
function renderEditExpRows(){
  const el=document.getElementById('edit-exp-rows');if(!el)return;
  el.innerHTML=S.expenses.map(e=>`
    <div class="exp-row">
      <input type="text" value="${e.name}" style="flex:1" onchange="updExpName(${e.id},this.value)" aria-label="Expense name">
      <input type="number" value="${e.amt||''}" placeholder="$" style="width:90px" onchange="updExpAmt(${e.id},this.value,'edit')" aria-label="Amount">
      <button class="exp-del" onclick="delExp(${e.id},'edit')" aria-label="Remove ${e.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`).join('');
  calcExpTotal('edit');
}
// Override openOv for exp-modal to pre-render
const _origOpenOv=openOv;
function openOv(id){
  if(id==='exp-modal')renderEditExpRows();
  if(id==='tax-modal'){
    document.getElementById('et-tax').value=Math.round(S.settings.taxRate*100);
    document.getElementById('et-hst').value=Math.round(S.settings.hstRate*100);
    document.getElementById('et-dues').value=Math.round(S.settings.duesRate*100);
    const knownCurrencies=['$','€','£','¥','₹'];
    const cur = S.currency||'$';
    const sel = document.getElementById('et-currency');
    if(sel){
      sel.value = knownCurrencies.includes(cur) ? cur : 'other';
      const otherField = document.getElementById('et-currency-other-field');
      const otherInput = document.getElementById('et-currency-other');
      if(!knownCurrencies.includes(cur)){ if(otherField) otherField.style.display='block'; if(otherInput) otherInput.value=cur; }
      else { if(otherField) otherField.style.display='none'; }
    }
  }
  if(id==='bkt-modal'){renderEditBktList();document.getElementById('ee-enjoy').value=Math.round(S.settings.enjoyPct*100);}
  document.getElementById(id).classList.add('open');
}
function saveExpenses(){S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);save();closeOv('exp-modal');renderSettings();track('expenses_updated');}
function saveTax(){
  S.settings.taxRate=(parseFloat(document.getElementById('et-tax').value)||32)/100;
  S.settings.hstRate=(parseFloat(document.getElementById('et-hst').value)||13)/100;
  S.settings.duesRate=(parseFloat(document.getElementById('et-dues').value)||3)/100;
  const cur = document.getElementById('et-currency')?.value || '$';
  S.currency = cur==='other' ? (document.getElementById('et-currency-other')?.value.trim()||'$') : cur;
  save(); closeOv('tax-modal'); renderSettings(); track('tax_settings_updated');
}

function renderEditBktList(){
  const el=document.getElementById('edit-bkt-list');if(!el)return;
  el.innerHTML=S.buckets.map(b=>`
    <div class="bucket-item" id="bkt-item-${b.id}" style="flex-direction:column;align-items:stretch;gap:6px">
      <div style="display:flex;align-items:center;gap:4px">
        <input class="bucket-name-input" value="${b.name}" onchange="updateBucket(${b.id},'name',this.value);renderEditBktList()" style="flex:1;border:none;background:transparent;font-size:15px;font-family:var(--font);color:var(--text);outline:none;cursor:text">
        <input type="number" class="bucket-pct-input" value="${b.pct}" min="0" max="100" onchange="updateBucket(${b.id},'pct',this.value);renderEditBktList()" style="width:48px;border:1px solid var(--border);border-radius:6px;padding:4px 6px;font-size:14px;font-family:var(--font);text-align:right;outline:none">
        <span style="font-size:13px;color:var(--muted)">%</span>
        <button class="bucket-del" onclick="removeBucket(${b.id});renderEditBktList()" aria-label="Remove ${b.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
      </div>
      <div style="display:flex;align-items:center;gap:6px;padding-left:2px">
        <span style="font-size:11px;color:var(--muted)" data-i18n="bkt_goal_label">Goal (optional)</span>
        <input type="number" value="${b.goalAmt||''}" placeholder="${t('bkt_goal_ph')}" onchange="updateBucket(${b.id},'goalAmt',this.value)" style="width:90px;border:1px solid var(--border);border-radius:6px;padding:4px 6px;font-size:13px;font-family:var(--font);outline:none">
      </div>
    </div>`).join('');
  updateEditPctLeft();
}
function saveGigSort(){
  const sel = document.getElementById('gig-sort');
  if(sel) S.lastGigSort = sel.value;
  save();
}
function saveRepSort(){
  const sel = document.getElementById('rep-acct-sort');
  if(sel) S.lastRepSort = sel.value;
  save();
}
function updateBucket(id, field, val){
  const b = S.buckets.find(x=>x.id===id); if(!b) return;
  if(field==='name') b.name = val.trim()||b.name;
  if(field==='goalAmt') b.goalAmt = parseFloat(val)||0;
  if(field==='pct'){
    const p = parseFloat(val)||0;
    const otherTotal = S.buckets.filter(x=>x.id!==id).reduce((t,x)=>t+x.pct,0);
    if(otherTotal + p > 100){ alert('Total would exceed 100%.'); return; }
    b.pct = p;
    // 0% keeps bucket visible but inactive — don't remove
  }
  save();
}
function addEditBucket(){
  const name=document.getElementById('eb-name').value.trim();
  const pct=parseFloat(document.getElementById('eb-pct').value)||0;
  const goalAmt=parseFloat(document.getElementById('eb-goal')?.value)||0;
  if(!name||pct<=0)return;
  if(usedPct()+pct>100){alert('Total would exceed 100%.');return;}
  S.buckets.push({id:Date.now(),name,pct,goalAmt});
  document.getElementById('eb-name').value='';document.getElementById('eb-pct').value='';
  if(document.getElementById('eb-goal')) document.getElementById('eb-goal').value='';
  renderEditBktList();
}
function updateEditPctLeft(){
  const l=100-usedPct();
  const el=document.getElementById('edit-pct-left');
  if(!el) return;
  if(l<=0){
    el.textContent='⚠️ Nothing left to invest — consider reducing a bucket.';
    el.style.color='var(--red)';
  } else {
    el.textContent=l+'% → Invest (automatic)';
    el.style.color='var(--sage)';
  }
}
function saveBuckets(){S.settings.enjoyPct=(parseFloat(document.getElementById('ee-enjoy').value)||20)/100;save();closeOv('bkt-modal');renderSettings();track('buckets_updated');}

// ===== DATA EXPORT / IMPORT =====
function exportData(){
  const exportObj={
    version:'aa_v5',
    exportDate:new Date().toISOString(),
    data:S
  };
  const blob=new Blob([JSON.stringify(exportObj,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='artisticautonomy_backup_'+new Date().toISOString().split('T')[0]+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
  track('data_exported');
  alert('Your data has been exported. Keep this file safe to restore your data at any time.');
}
function importData(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const obj=JSON.parse(e.target.result);
      if(!obj.version||!obj.data){alert('This file does not appear to be a valid artisticAutonomy backup.');return;}
      if(confirm('This will replace your current data with the backup from '+new Date(obj.exportDate).toLocaleDateString()+'. Continue?')){
        S={...S,...obj.data};
        save();
        renderSettings();
        updateDash();
        alert('Data restored successfully.');
        track('data_imported');
      }
    }catch(err){alert('Could not read the backup file. Please use a valid artisticAutonomy export.');}
  };
  reader.readAsText(file);
  input.value='';
}



// PostHog — defined after all app functions
(function(){try{
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.people.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_r6fQPiBALkq68Z4QkyWjtstrkK4EVHev9aJz2PBY4TSs',{api_host:'https://us.i.posthog.com',autocapture:false,capture_pageview:false,loaded:function(ph){ph.identify(getAnonId());}});
}catch(e){console.log('analytics err',e);}})();
