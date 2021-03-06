// ERPNext - web based ERP (http://erpnext.com)
// Copyright (C) 2012 Web Notes Technologies Pvt Ltd
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

cur_frm.cscript.refresh = function(doc, cdt, cdn) {
	if(doc.abbr && !doc.__islocal)
		cur_frm.set_df_property("abbr", "read_only", 1)
		
	if(!doc.__islocal) {
		cur_frm.toggle_enable("default_currency", !cur_frm.doc.__transactions_exist);
	}
}

cur_frm.cscript.has_special_chars = function(t) {
  var iChars = "!@#$%^*+=-[]\\\';,/{}|\":<>?";
  for (var i = 0; i < t.length; i++) {
    if (iChars.indexOf(t.charAt(i)) != -1) {
      return true;
    }
  }
  return false;
}

cur_frm.cscript.company_name = function(doc){
  if(doc.company_name && cur_frm.cscript.has_special_chars(doc.company_name)){   
    msgprint("<font color=red>Special Characters <b>! @ # $ % ^ * + = - [ ] ' ; , / { } | : < > ?</b> are not allowed for</font>\nCompany Name <b>" + doc.company_name +"</b>")        
    doc.company_name = '';
    refresh_field('company_name');
  }
}

cur_frm.cscript.abbr = function(doc){
  if(doc.abbr && cur_frm.cscript.has_special_chars(doc.abbr)){   
    msgprint("<font color=red>Special Characters <b>! @ # $ % ^ * + = - [ ] ' ; , / { } | : < > ?</b> are not allowed for</font>\nAbbr <b>" + doc.abbr +"</b>")        
    doc.abbr = '';
    refresh_field('abbr');
  }
}

cur_frm.fields_dict.default_cash_account.get_query = cur_frm.fields_dict.default_bank_account.get_query;

cur_frm.fields_dict.default_bank_account.get_query = function(doc) {    
	return{
		filters:{
			'company': doc.name,
			'group_or_ledger': "Ledger",
			'account_type': "Bank or Cash"
		}
	}  
}

cur_frm.fields_dict.payables_group.get_query = cur_frm.fields_dict.receivables_group.get_query;

cur_frm.fields_dict.receivables_group.get_query = function(doc) {  
	return{
		filters:{
			'company': doc.name,
			'group_or_ledger': "Group"
		}
	}  
}

if (sys_defaults.auto_inventory_accounting) {
	cur_frm.fields_dict["stock_in_hand_account"].get_query = function(doc) {
		return {
			"filters": {
				"is_pl_account": "No",
				"debit_or_credit": "Debit",
				"company": doc.name,
				'group_or_ledger': "Ledger"
			}
		}
	}

	cur_frm.fields_dict["stock_adjustment_account"].get_query = function(doc) {
		return {
			"filters": {
				"is_pl_account": "Yes",
				"debit_or_credit": "Debit",
				"company": doc.name,
				'group_or_ledger': "Ledger"
			}
		}
	}

	cur_frm.fields_dict["expenses_included_in_valuation"].get_query = 
		cur_frm.fields_dict["stock_adjustment_account"].get_query;

	cur_frm.fields_dict["stock_received_but_not_billed"].get_query = function(doc) {
		return {
			"filters": {
				"is_pl_account": "No",
				"debit_or_credit": "Credit",
				"company": doc.name,
				'group_or_ledger': "Ledger"
			}
		}
	}

	cur_frm.fields_dict["stock_adjustment_cost_center"].get_query = function(doc) {
		return {
			"filters": {"company": doc.name}
		}
	}
}