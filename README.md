Feature branch
# epicc-xl
MS Excel based plugin for Epicc
# cc_acute
Returns the subset of a cc list that pertain to acute conditions
# cc_chronic
Returns the subset of a cc list that pertain to chronic conditions
# cc_combine
Returns a list of ccs after combining them and applying trumping/interaction logic
# cc_desc
Returns comma-separated list of descriptions of each HCC Code from CMS crosswalk
# cc_diff
Compares a base list of ccs and additional ccs and returns an information block on the differences ; eg: "Adds: HCC001, HCC18; Deletes: HCC135; Upgraded: HCC019; Downgraded:"
# cc_diff_adds
Compares a base list of ccs and additional ccs and returns a list of ccs that are considered adds over the baseline.
# cc_diff_adds_raf
Returns the net raf value of ccs that are considered adds over the baseline.
# cc_diff_deletes
Compares a base list of ccs and additional ccs and returns a list of ccs that are deletes between the additional codes vs the baseline.
# cc_diff_deletes_raf
Returns the net raf value of ccs that are deletes between the additional codes vs the baseline.
# cc_diff_downgrade_to
Compares a base list of ccs and additional ccs and returns a list of ccs that are downgraded_to in additional codes compared to the baseline.
# cc_diff_downgraded
Compares a base list of ccs and additional ccs and returns a list of ccs that are downgraded in the baseline compared to additional codes.
# cc_diff_raf
Returns net raf difference between baseline ccs and additional ccs
# cc_diff_upgraded
Compares a base list of ccs and additional ccs and returns a list of ccs that are considered upgraded in the baseline.
# cc_gaps
Compares a base list of ccs and additional ccs and returns a list of ccs that are deletes or downgrades between the additional codes vs the baseline
# cc_gaps_raf
Compares a base list of ccs and additional ccs and returns raf of ccs that are deletes or downgrades between the additional codes vs the baseline
# cc_hybrid
Returns the subset of a cc list that pertain to hybrid (both acute and chronic) conditions
# cc_increment
Returns the net incremental change between cc_lists, for example for calculating the value of a coding project over claims. Equivalent of +Adds - Upgraded in the format('+HCC001, +HCC18, - HCC019')
# cc_increment_raf
Returns the RAF of the net incremental change (+Adds - Upgraded) between cc_lists. Equivalent of cc_raf(cc_diff_increment)
# cc_info
Returns multi-line info block for an HCC: Description, Children, Parents, RAF
# cc_raf
Returns cc raf (does not include demographic RAF) of cc codes after trumping/interaction logic is applied
# clean_cc
Given a list of ccs, return a list of deduped, normalized and untrumped ccs codes valid for the coding model
# clean_dx
Given a list of dx codes, return a list of deduped, normalized and untrumped dx codes valid for the coding model
# demo_raf
Returns demographic raf value based on age, gender and coding model
# dx2cc
Returns a comma separated list of the ccs represented by a list of DX codes after trumping/interaction logic is applied
# dx_acute
Returns the subset of a dx list that pertain to acute conditions
# dx_chronic
Returns the subset of a dx list that pertain to chronic conditions
# dx_desc
Returns comma-separated list of descriptions of each DX Code from CMS crosswalk
# dx_diff
Compares a base list of dx and additional dx and returns an information block on the differences ; eg: "Adds: E119, I2720; Deletes: I495; Upgraded: F10250; Downgraded:"
# dx_diff_raf
Returns net raf difference between baseline ccs and additional ccs
# dx_duration
Utility to Classify a list of DxCodes as acute or chronic.
# dx_gaps_raf
dx_diff_deletes_raf focuses on YoY Chronic Gaps and downgrades (net raf of downgraded). Equivalent of dx_chronic(dx_diff_deletes).
# dx_increment
Returns the net incremental change between dx_lists, for example for calculating the value of a coding project over claims. Equivalent of +Adds - Upgraded in the format('+dx001, +dx18, - dx019')
# dx_increment_raf
Returns the RAF of the net incremental change (+Adds - Upgraded) between dx_lists. Equivalent of dx_raf(dx_diff_increment)
# dx_profile_compare
Returns the result data by comparing dx_values of the 2 sets of user data(2 different excel sheets)
# dx_raf
Returns cc raf of associated dx codes after conversion to cc and trumping/interaction logic is applied (equivalent of cc_raf(dx2cc(dx_array))
# hcc_duration
Utility to Classify a list of HCC as acute or chronic.
# hcc_profile_compare
Returns the result data by comparing hcc_values of the 2 sets of user data(2 different excel sheets)
# memprofile
Returns the user data grouped by a certain grouping criteria











