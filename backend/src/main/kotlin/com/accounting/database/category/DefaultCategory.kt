package com.accounting.database.category

import com.accounting.database.account.Account

const val ASSETS_CATEGORY_NAME = "Assets"
const val LIABILITIES_CATEGORY_NAME = "Liabilities & Equity"
const val EXPENSE_CATEGORY_NAME = "Expense"
const val REVENUE_CATEGORY_NAME = "Revenue"
const val BALANCE_CATEGORY_NAME = "Balance Sheet"

val defaultCategories =
    Category.Builder("All Accounts", editable = false) {
        subcategories(
            Category.Builder(ASSETS_CATEGORY_NAME, editable = false) {
                subcategories(
                    Category.Builder("Current Assets") {
                        subcategories(
                            Category.Builder("Liquid Funds") {
                                accounts(
                                    Account.Builder(1000, "Cash"),
                                    Account.Builder(1010, "Postal Account"),
                                    Account.Builder(1020, "Bank Account"),
                                )
                            },
                            Category.Builder("Short-Term Securities") {
                                accounts(
                                    Account.Builder(1060, "Marketable Securities"),
                                )
                            },
                            Category.Builder("Accounts Receivable Trade") {
                                accounts(
                                    Account.Builder(1100, "Accounts Receivable"),
                                    Account.Builder(1109, "Allowance for Doubtful Accounts"),
                                )
                            },
                            Category.Builder("Other Short-Term Receivables") {
                                accounts(
                                    Account.Builder(1140, "Advances and Loans"),
                                    Account.Builder(1170, "Sales Tax Receivable"),
                                    Account.Builder(1172, "Input Tax Compensation Settlement Method"),
                                    Account.Builder(1176, "Withholding Tax Receivable"),
                                    Account.Builder(1180, "Social Security Receivable"),
                                    Account.Builder(1190, "Other Short-Term Receivables"),
                                )
                            },
                            Category.Builder("Inventories") {
                                accounts(
                                    Account.Builder(1200, "Trade Goods"),
                                    Account.Builder(1210, "Raw Materials"),
                                    Account.Builder(1260, "Finished Products"),
                                    Account.Builder(1270, "Unfinished Products"),
                                    Account.Builder(1280, "Services Not Yet Invoiced"),
                                )
                            },
                            Category.Builder("Accruals and Deferrals") {
                                accounts(
                                    Account.Builder(1300, "Prepaid Expenses"),
                                    Account.Builder(1301, "Revenue Not Yet Received"),
                                )
                            },
                        )
                    },
                    Category.Builder("Fixed Assets") {
                        subcategories(
                            Category.Builder("Financial Assets") {
                                accounts(
                                    Account.Builder(1400, "Securities"),
                                    Account.Builder(1430, "Other Financial Assets"),
                                    Account.Builder(1440, "Loans"),
                                    Account.Builder(1441, "Mortgages"),
                                )
                            },
                            Category.Builder("Holdings") {
                                accounts(
                                    Account.Builder(1480, "Holdings"),
                                )
                            },
                            Category.Builder("Mobile Tangible Assets") {
                                accounts(
                                    Account.Builder(1500, "Machinery and Production Plants"),
                                    Account.Builder(1510, "Furniture and Equipment"),
                                    Account.Builder(1520, "Office Machines, Computers"),
                                    Account.Builder(1530, "Vehicles"),
                                    Account.Builder(1540, "Tools"),
                                )
                            },
                            Category.Builder("Immobile Tangible Assets") {
                                accounts(
                                    Account.Builder(1600, "Commercial Properties"),
                                )
                            },
                            Category.Builder("Intangible Assets") {
                                accounts(
                                    Account.Builder(1700, "Patents, Licenses, Copyrights"),
                                    Account.Builder(1770, "Goodwill"),
                                )
                            },
                            Category.Builder("Not Paid-In Capital") {
                                accounts(
                                    Account.Builder(1850, "Not Paid-In Capital"),
                                )
                            },
                        )
                    },
                )
            },
            Category.Builder(LIABILITIES_CATEGORY_NAME, editable = false) {
                subcategories(
                    Category.Builder("Current Liabilities") {
                        subcategories(
                            Category.Builder("Accounts Payable Trade") {
                                accounts(
                                    Account.Builder(2000, "Accounts Payable"),
                                    Account.Builder(2030, "Advances Received"),
                                )
                            },
                            Category.Builder("Interest-Bearing Liabilities") {
                                accounts(
                                    Account.Builder(2100, "Short-Term Bank Liabilities"),
                                    Account.Builder(2120, "Short-Term Financial Leasing"),
                                    Account.Builder(2140, "Other Interest-Bearing Liabilities"),
                                )
                            },
                            Category.Builder("Other Liabilities") {
                                accounts(
                                    Account.Builder(2200, "Sales Tax Payable"),
                                    Account.Builder(2202, "Tax Compensation Settlement Method"),
                                    Account.Builder(2206, "Withholding Tax Payable"),
                                    Account.Builder(2208, "Direct Taxes"),
                                    Account.Builder(2210, "Other Short-Term Liabilities"),
                                    Account.Builder(2222, "Payroll Clearing Account"),
                                    Account.Builder(2261, "Profit Distribution"),
                                    Account.Builder(2270, "Creditor Pension Funds"),
                                    Account.Builder(2271, "Creditor OASI/DI/IC/UI"),
                                    Account.Builder(2272, "Creditor FCF"),
                                    Account.Builder(2273, "Creditor Accident Insurance"),
                                    Account.Builder(2274, "Creditor DIB"),
                                    Account.Builder(2279, "Withholding Tax"),
                                )
                            },
                            Category.Builder("Accruals and Deferrals") {
                                accounts(
                                    Account.Builder(2300, "Expenses Not Yet Paid"),
                                    Account.Builder(2301, "Unearned Revenue"),
                                    Account.Builder(2330, "Short-Term Provisions"),
                                )
                            },
                        )
                    },
                    Category.Builder("Long-Term Liabilities") {
                        subcategories(
                            Category.Builder("Interest-Bearing Liabilities") {
                                accounts(
                                    Account.Builder(2400, "Long-Term Bank Liabilities"),
                                    Account.Builder(2420, "Long-Term Financial Leasing"),
                                    Account.Builder(2430, "Bonds Payable"),
                                    Account.Builder(2450, "Loans"),
                                    Account.Builder(2451, "Mortgages"),
                                )
                            },
                            Category.Builder("Other Liabilities") {
                                accounts(
                                    Account.Builder(2500, "Non-Interest-Bearing Long-Term Liabilities"),
                                )
                            },
                            Category.Builder("Accruals and Deferrals") {
                                accounts(
                                    Account.Builder(2600, "Long-Term Provisions"),
                                )
                            },
                        )
                    },
                    Category.Builder("Equity") {
                        subcategories(
                            Category.Builder("Nominal Capital") {
                                accounts(
                                    Account.Builder(2800, "Nominal Capital, Share Capital"),
                                    Account.Builder(2820, "Private Equity (Partner)"),
                                    Account.Builder(2850, "Private Equity (Sole Entrepreneur)"),
                                )
                            },
                            Category.Builder("Reserves") {
                                accounts(
                                    Account.Builder(2900, "Statutory Capital Reserves"),
                                    Account.Builder(2930, "Reserve for Own Shares"),
                                    Account.Builder(2940, "Revaluation Reserve"),
                                    Account.Builder(2950, "Statutory Retained Earnings"),
                                    Account.Builder(2960, "Voluntary Retained Earnings"),
                                    Account.Builder(2979, "Annual Profit or Loss"),
                                )
                            },
                        )
                    },
                )
            },
            Category.Builder(EXPENSE_CATEGORY_NAME, editable = false) {
                subcategories(
                    Category.Builder("Expenses Materials, Goods, Services") {
                        accounts(
                            Account.Builder(4000, "Cost of Materials"),
                            Account.Builder(4200, "Cost of Goods Sold"),
                            Account.Builder(4400, "Cost of Services"),
                            Account.Builder(4500, "Energy Cost of Production"),
                            Account.Builder(4900, "Expensive Reductions"),
                        )
                    },
                    Category.Builder("Personnel Expenses") {
                        accounts(
                            Account.Builder(5000, "Salaries"),
                            Account.Builder(5001, "Allowances"),
                            Account.Builder(5002, "Profit-Sharing"),
                            Account.Builder(5003, "Commissions"),
                            Account.Builder(5005, "Social Insurance Benefits"),
                            Account.Builder(5070, "OASI/DI/IC/UI"),
                            Account.Builder(5071, "FCF"),
                            Account.Builder(5072, "Pension Funds"),
                            Account.Builder(5073, "Accident Insurance"),
                            Account.Builder(5074, "DIB"),
                            Account.Builder(5079, "Withholding Tax"),
                            Account.Builder(5600, "Administrative Salaries"),
                            Account.Builder(5700, "Social Benefits"),
                            Account.Builder(5800, "Other Personnel Expenses"),
                            Account.Builder(5810, "Training, Education"),
                            Account.Builder(5820, "Travel Expenses"),
                            Account.Builder(5821, "Meal Expenses"),
                            Account.Builder(5822, "Accommodation Expenses"),
                            Account.Builder(5823, "Other Actual Expenses"),
                            Account.Builder(5830, "Flat-Rate Expenses"),
                            Account.Builder(5890, "Private Shares of Personnel Expenses"),
                            Account.Builder(5900, "Third-Party Services"),
                        )
                    },
                    Category.Builder("Other Operating Expenses") {
                        accounts(
                            Account.Builder(6000, "Occupancy Expenses"),
                            Account.Builder(6100, "Maintenance Expenses"),
                            Account.Builder(6105, "Leasing Expenses Mobile Tangible Assets"),
                            Account.Builder(6200, "Vehicle and Transportation Expenses"),
                            Account.Builder(6260, "Vehicle Leasing and Rent"),
                            Account.Builder(6300, "Property Insurance, Fees, Permits"),
                            Account.Builder(6400, "Energy and Disposal Expenses"),
                            Account.Builder(6500, "Administrative Expenses"),
                            Account.Builder(6570, "IT Expenses"),
                            Account.Builder(6600, "Advertising Expenses"),
                            Account.Builder(6700, "Other Operating Expenses"),
                            Account.Builder(6800, "Depreciations"),
                            Account.Builder(6801, "Fixed Asset Disposals"),
                            Account.Builder(6900, "Financial Expenses"),
                            Account.Builder(6950, "Financial Revenue"),
                            Account.Builder(6960, "Exchange Differences"),
                            Account.Builder(6961, "Rounding Differences"),
                        )
                    },
                    Category.Builder("Secondary Operating Expenses and Revenue") {
                        accounts(
                            Account.Builder(7000, "Revenue From Ancillary Operations"),
                            Account.Builder(7010, "Expenses From Ancillary Operations"),
                            Account.Builder(7500, "Revenue From Immobile Tangible Assets"),
                            Account.Builder(7510, "Expenses From Immobile Tangible Assets"),
                            Account.Builder(7900, "Revenue From Mobile Tangible Assets"),
                            Account.Builder(7910, "Revenue From Intangible Assets"),
                        )
                    },
                    Category.Builder("Extraordinary Expenses and Revenue") {
                        accounts(
                            Account.Builder(8000, "Non-Operating Expenses"),
                            Account.Builder(8100, "Non-Operating Revenue"),
                            Account.Builder(8500, "Extraordinary Expenses"),
                            Account.Builder(8510, "Extraordinary Revenue"),
                            Account.Builder(8900, "Direct Taxes"),
                        )
                    },
                )
            },
            Category.Builder(REVENUE_CATEGORY_NAME, editable = false) {
                subcategories(
                    Category.Builder("Operating Revenue") {
                        accounts(
                            Account.Builder(3000, "Production Revenue"),
                            Account.Builder(3200, "Trading Revenue"),
                            Account.Builder(3400, "Services Revenue"),
                            Account.Builder(3600, "Other Trading Revenue"),
                            Account.Builder(3700, "Personal Contributions"),
                            Account.Builder(3710, "Own Consumption"),
                            Account.Builder(3800, "Loss of Earnings"),
                            Account.Builder(3805, "Losses on Accounts Receivable"),
                            Account.Builder(3900, "Inventory Change Unfinished Products"),
                            Account.Builder(3901, "Inventory Change Finished Products"),
                            Account.Builder(3940, "Inventory Change Services Not Yet Invoiced"),
                        )
                    },
                )
            },
            Category.Builder(BALANCE_CATEGORY_NAME, editable = false) {
                subcategories(
                    Category.Builder("Opening / Closing") {
                        accounts(
                            Account.Builder(9100, "Opening Balance"),
                            Account.Builder(9200, "Annual Profit or Loss"),
                            Account.Builder(9900, "Corrections"),
                        )
                    },
                )
            }
        )
    }