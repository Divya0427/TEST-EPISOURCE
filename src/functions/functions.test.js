
const {
  demo_raf,
  dx_desc,
  dx2cc,
  dx_raf,
  clean_dx,
  clean_cc,
  dx_increment,
  dx_increment_raf,
  dx_gaps,
  dx_gaps_raf,
  cc_desc,
  cc_info,
  cc_raf,
  cc_combine,
  cc_gaps,
  cc_gaps_raf,
  cc_diff,
  cc_diff_raf,
  cc_increment,
  cc_increment_raf,
  dx_diff,
  dx_diff_raf,
  cc_diff_adds,
  cc_diff_adds_raf,
  cc_diff_deletes,
  cc_diff_deletes_raf,
  cc_diff_upgraded,
  cc_diff_downgraded,
  cc_diff_downgrade_to,
  cc_acute,
  cc_chronic,
  cc_hybrid,
  dx_acute,
  dx_chronic,
  memprofile,
  dx_profile_compare,
  hcc_profile_compare,
  getdefaultvalue,
  assignDefaultValues,
  hcc_gaps,
  dx_gap,
  cc_rafs,
  dx2raf,
  dx2hcc,
  dx_hccs,
  clean_dxlist,
  clean_hcclist,
  hcc2raf,
  prep_hccs,
  trump_hccs,
  hcc_dct,
  hcc_increment,
  dx_increments,
  dx_diffc,
  hcc_diff,
  member,
  condition_resolver,
  get_raf,
  v22_interactions,
  v23_interactions,
  v24_interactions
} = require("./functions");



// demo_raf Pass Test Cases
test('demo_raf: input: ""C7910,NOTADX,D61.810,E1100,E133413",90,"F","OREC","v22",0.0 output: "0.797"', () => {
  expect(demo_raf("C7910,NOTADX,D61.810,E1100,E133413", 90, "F", "", "", "v22", 0.0)).resolves.toBe("0.797");
});

// demo_raf Pass Test Cases
test('demo_raf: input: ""C7910,NOTADX,D61.810,E1100,E133413" output: "0.797"', () => {
  expect(demo_raf("C7910,NOTADX,D61.810,E1100,E133413")).resolves.not.toBe("-0.797");
});

// demo_raf Fail Test Cases
test('demo_raf: input: ""C7910,NOTADX,D61.810,E1100,E133413",90,"F","OREC","v22",0.0 output: "0.797"', () => {
  expect(demo_raf("C7910,NOTADX,D61.810,E1100,E133413", 90, "F", "", "", "v22", 0.0)).resolves.not.toBe("-0.797");
});


test('demo_raf: input: ""C7910,NOTADX,D61.810,E1100,E133413",90,"F","OREC","v22",0.0 output: "0.797"', () => {
  expect(demo_raf("C7910,NOTADX,D61.810,E1100,E133413")).resolves.not.toBe("-0.797");
});

//dx_desc Pass Test Cases
test('dx_desc: input: "e11.9, v23" output: "E119:Type 2 diabetes mellitus without complications"', () => {
  expect(dx_desc("e11.9", "v23",0,"M",false)).resolves.toBe("E119:Type 2 diabetes mellitus without complications");
});
//dx_desc Pass Test Cases
test('dx_desc: input: "e11.9, output: "E119:Type 2 diabetes mellitus without complications"', () => {
  expect(dx_desc("e11.9")).resolves.toBe("E119:Type 2 diabetes mellitus without complications");
});


//dx_desc Fail Test Cases
test('dx_desc: input: "e11.51, v22" output: "E1111:Type 2 diabetes mellitus with ketoacidosis with coma"', () => {
  expect(dx_desc("e11.51", "v22")).not.toBe("E1111:Type 2 diabetes mellitus with ketoacidosis with coma");
});


//dx2cc Pass Test Cases
test('dx2cc: input: "F205, E840", 65, "v23", "INS" output: "HCC57,HCC110,SCHIZOPHRENIA_gCopdCF"', () => {
  expect(dx2cc("F205,E840", 65, "v23", "INS")).resolves.toBe("HCC57,HCC110,SCHIZOPHRENIA_gCopdCF");
});

//dx2cc Pass Test Cases
test('dx2cc: input: "F205, E840" output: "HCC57,HCC110"',  () => {
  expect(dx2cc("F205,E840")).resolves.toBe("HCC57,HCC110");
});
//dx2cc Pass Test Cases
test('dx2cc: input: "F205, E840" output: "HCC110"', () => {
  expect(dx2cc("F204,E840")).resolves.toBe("HCC110");
});
//dx2cc Fail Test Cases
test('dx2cc: input: "J9502, I281, E840", 65, "v23", "CPA" output: "HCC110, HCC85, HCC82, gRespDepandArre_gCopdCF, HCC85_gCopdCF"', () => {
  expect(dx2cc("J9502, I281, E840", 65, "v23", "CPA")).resolves.not.toBe(
    "HCC110, HCC85, HCC82, gRespDepandArre_gCopdCF, HCC85_gCopdCF"
  );
});

//dx_raf Pass Test Cases
test('dx_raf: input: "E119", 65, "v24","CNA","F",True,True,True,900 output: "0.105"', () => {
  expect(dx_raf("E119", 65, "v24", "CNA", "F", "True", "True", "True", 900)).resolves.toBe("0.105");
});
//dx_raf Pass Test Cases
test('dx_raf: input: "E119" output: "0.106"', () => {
  expect(dx_raf("E119")).resolves.toBe("0.106");
});

//dx_raf Fail Test Cases
test('dx_raf: input: "E1111",40, "v22","CFA","F","True","True","True",900 output: "0.376"', () => {
  expect(dx_raf("E1111", 40, "v22", "CFA", "F", "True", "True", "True", 900)).not.toBe("0.376");
});

//clean_dx Pass Test Cases
test('clean_dx: input: "E119, v24" output: "E119"', () => {
  expect(clean_dx("E119", "v24")).resolves.toBe("E119");
});
//clean_dx Pass Test Cases
test('clean_dx: input: "E119" output: "E119"', () => {
  expect(clean_dx("E119")).resolves.toBe("E119");
});

//clean_dx Fail Test Cases
test('clean_dx: input: "D330, v22" output: "D3330"', () => {
  expect(clean_dx("D330", "v22")).resolves.not.toBe("D3330");
});

// clean_cc Pass Test Cases
test('clean_cc: input: "19, v24" output: "HCC19"', () => {
  expect(clean_cc("19", "v24")).resolves.toBe("HCC19");
});

// clean_cc Pass Test Cases
test('clean_cc: input: "19" output: "HCC19"', () => {
  expect(clean_cc("19")).resolves.toBe("HCC19");
});

// clean_cc Fail Test Cases
test('clean_cc: input: "HCC001, v24" output: "HCC3"', () => {
  expect(clean_cc("HCC001", "v24")).resolves.not.toBe("HCC3");
});

// clean_cc Test Cases
test('clean_cc: input: "19, v24" output: "HCC19"', () => {
  expect(clean_cc("19", "v24")).resolves.toBe("HCC19");
});
test('clean_cc: input: "HCC001, v24" output: "HCC1"', () => {
  expect(clean_cc("HCC001", "v24")).resolves.toBe("HCC1");
});
test('clean_cc: input: "hcc18, v24" output: "HCC18"', () => {
  expect(clean_cc("hcc18", "v24")).resolves.not.toBe("HCC19");
});

//dx_increment Pass Test Cases
test('dx_increment: input: "E119,F1110","E1111,E1042,F1020" output: "E1111,F1020,-E119,-F1110"', () => {
  expect(dx_increment("E119,F1110", "E1111,E1042,F1020",0,0)).resolves.toBe("E1111,F1020,-E119,-F1110");
});

test('dx_increment: input: "","" output: "0"', () => {
  expect(dx_increment()).resolves.toBe("");
});

//dx_increment Fail Test Cases
test('dx_increment: input: "E119,F1110","E1111,E1042,F1020" output: "E1042,-E119"', () => {
  expect(dx_increment("E119,F10250", "E1042,F1020","v23","CNA")).resolves.not.toBe("C770");
});

//dx_increment_raf Pass Test Cases
test('dx_increment_raf: input: "E119,F1110","E1111,E1042,F1020","v23","CPD" output: "0.254"', () => {
  expect(dx_increment_raf("E119,F1110", "E1111,E1042,F1020", "v23", "CPD")).resolves.toBe("0.254");
});
test('dx_increment_raf: input: ', () => {
  expect(dx_increment_raf()).resolves.toBe("0.000");
});

// dx_increment_raf Fail Test Cases
test('dx_increment_raf: input: "E119,F1110","E1111,E1042,F1020","v23","CPD" output: "0.254"', () => {
  expect(dx_increment_raf("E119,F1110,K7111,D599,I213", "E1111,F1020,K744,D599,C770")).resolves.not.toBe("0.254");
});

// dx_gaps Pass Test Cases
test('dx_gaps: input: "E119,I281","E1111,E1042,F1020,v23,CNA" output: "I281"', () => {
  expect(dx_gaps("E119,I281", "E1111,E1042,F1020","v23","CNA")).resolves.toBe("I281");
});

test('dx_gaps: input: "" output: ""', () => {
  expect(dx_gaps()).resolves.toBe("");
});

// dx_gaps Fail Test Cases
test('dx_gaps: input: "E1042,F10250,D708,I281","E119,F1020",0,0 output: "D708,I281,F10250,E1042"', () => {
  expect(dx_gaps("E1042,F10250,D708,I281", "E119,F1020",0,0)).resolves.not.toBe("D708,I281,F10250,E1042");
});

// dx_gaps_raf Pass Test Cases
test('dx_gaps_raf: input: "E119,I281","E1111,E1042,F1020","v23","CPD" output: "-0.376"', () => {
  expect(dx_gaps_raf("E119,I281", "E1111,E1042,F1020", "v23", "CPD")).resolves.toBe("-0.376");
});
test('dx_gaps_raf: input: "" output: "0.000"', () => {
  expect(dx_gaps_raf()).resolves.toBe("0.000");
});

// dx_gaps_raf Fail Test Cases
test('dx_gaps_raf: input: "T8602","C770","","" output: "-0.855"', () => {
  expect(dx_gaps_raf("T8602", "C770", "", "")).resolves.not.toBe("-0.55");
});

// cc_desc
test("cc_desc function test, i/p: HCC19, HCC85", () => {
  expect(cc_desc("HCC19", "v24")).resolves.toBe("HCC19:Diabetes without Complication");
});
test("cc_desc function test, i/p: HCC1", () => {
  expect(cc_desc("HCC1", "v22")).resolves.toBe("HCC1:HIV/AIDS");
});
test("cc_desc function test, i/p: 19", () => {
  expect(cc_desc("19", "v23")).not.toBe("HCC1:HIV/AIDS");
});
test("cc_desc function test, i/p: 19", () => {
  expect(cc_desc("19")).not.toBe("HCC1:HIV/AIDS");
});

// test for CC Info
test("Test for CC_INFO (CASE 1)", () => {
  expect(cc_info("HCC85", "v23", "CFA")).resolves.toBe("desc: Congestive Heart Failure, children: , parents: , RAF: 0.355");
});
test("Test for CC_INFO (CASE 2)", () => {
  expect(cc_info("HCC10", "v22", "CPD")).resolves.toBe(
    "desc: Lymphoma and Other Cancers, children: HCC11,HCC12, parents: HCC8,HCC9, RAF: 0.577"
  );
});
test("Test for CC_INFO (CASE 2)", () => {
  expect(cc_info("HCC10")).resolves.toBe(
    "desc: Lymphoma and Other Cancers, children: HCC11,HCC12, parents: HCC8,HCC9, RAF: 0.675"
  );
});
test("Test for CC_INFO (CASE 3) {negative}", () => {
  expect(cc_info("HCC96", "v23", "INS")).resolves.not.toBe(
    "desc: Spinal Cord Disorders/Injuries, children: HCC169, parents: HCC70, HCC71, RAF: 0.519"
  );
});

// test for cc_ raf
test("Test for CC_RAF (case 1)", () => {
  expect(cc_raf("HCC19", "v24")).resolves.toBe("0.105");
});
test("Test for CC_RAF (case 2)", () => {
  expect(cc_raf("HCC1", "v23")).resolves.toBe("0.344");
});
test("Test for CC_RAF (case 2)", () => {
  expect(cc_raf("HCC1")).resolves.toBe("0.344");
});
test("Test for CC_RAF (case 8)", () => {
  expect(cc_raf("HCC8", "v22")).resolves.not.toBe("0.344");
});

// Test for CC_Combine
test("Test for CC_COMBINE (CASE 1) ", () => {
  expect(cc_combine("HCC56,HCC57", "v24")).resolves.toBe("HCC56,HCC57,gSubstanceAbuse_gPsychiatric_V24");
});
test("Test for CC_COMBINE (CASE 2) ", () => {
  expect(cc_combine("HCC2,HCC158", "v24", "INS")).resolves.toBe("HCC2,HCC158,PRESSURE_ULCER,SEPSIS_PRESSURE_ULCER");
});
test("Test for CC_COMBINE (CASE 2) ", () => {
  expect(cc_combine("HCC2,HCC158")).resolves.toBe("HCC2,HCC158");
});
test("Test for CC_COMBINE (CASE 3) {negative} ", () => {
  expect(cc_combine("HCC17,HCC18,HCC8,HCC10", "v23")).resolves.not.toBe("HCC17,HCC18");
});

// cc gaps_RAF
test("Test for CC_GAPS_RAF (CASE 1) ", () => {
  expect(cc_gaps_raf("HCC19,HCC85", "HCC17,HCC18,HCC55", "v23", "CFD")).resolves.toBe("-0.441");
});
test("Test for CC_GAPS_RAF (CASE 2) ", () => {
  expect(cc_gaps_raf("HCC47,HCC8", "HCC12")).resolves.toBe("-3.184");
});
test("Test for CC_GAPS_RAF (CASE 2) ", () => {
  expect(cc_gaps_raf("HCC47,HCC8", "HCC12,HCC18")).resolves.not.toBe("-1.184");
});
test("Test for CC_GAPS_RAF (CASE 2) ", () => {
  expect(cc_gaps_raf()).resolves.not.toBe("-1.184");
});

// CC_GAPS
test("Test for CC_GAPS (CASE 1) ", () => {
  expect(cc_gaps("HCC19,HCC85", "HCC17,HCC18,HCC55", "v23","CNA")).resolves.toBe("HCC85,HCC85_gDiabetesMellit");
});
test("Test for CC_GAPS (CASE 1) ", () => {
  expect(cc_gaps("HCC19,HCC85", "HCC17,HCC18,HCC55", "v23")).resolves.toBe("HCC85,HCC85_gDiabetesMellit");
});
test("Test for CC_GAPS (CASE 2) ", () => {
  expect(cc_gaps("HCC19,HCC56", "HCC85,HCC55")).resolves.toBe("HCC19");
});
test("Test for CC_GAPS (CASE 3) ", () => {
  expect(cc_gaps("HCC18,HCC19", "HCC85,HCC55")).resolves.not.toBe("HCC1");
});
test("Test for CC_GAPS (CASE 3) ", () => {
  expect(cc_gaps()).resolves.not.toBe("HCC1");
});

//cc_diff
test("Test for CC_diff (CASE 1) ", () => {
  expect(cc_diff("HCC19,HCC56", "HCC17,HCC18,HCC55", "v23")).resolves.toBe(
    "adds: HCC17,HCC55, upgraded: HCC19,HCC56, downgraded: , downgraded_to: , deletes: "
  );
});
test("Test for CC_diff (CASE 2) ", () => {
  expect(cc_diff("HCC19,HCC56,HCC27,HCC46,HCC86", "HCC17,HCC55,HCC28,HCC46,HCC8","","","","CNA")).resolves.toBe(
    "adds: HCC8,HCC17,HCC55, upgraded: HCC19,HCC56, downgraded: HCC27, downgraded_to: HCC28, deletes: HCC86"
  );
});
test("Test for CC_diff (CASE 2) ", () => {
  expect(cc_diff("HCC19,HCC56,HCC27,HCC46,HCC86", "HCC17,HCC55,HCC28,HCC46,HCC8","","","",0)).resolves.toBe(
    "adds: HCC8,HCC17,HCC55, upgraded: HCC19,HCC56, downgraded: HCC27, downgraded_to: HCC28, deletes: HCC86"
  );
});

test("Test for CC_diff (CASE 2) ", () => {
  expect(cc_diff("HCC19,HCC56,HCC27,HCC46,HCC86", "HCC17,HCC55,HCC28,HCC46,HCC8")).resolves.toBe(
    "adds: HCC8,HCC17,HCC55, upgraded: HCC19,HCC56, downgraded: HCC27, downgraded_to: HCC28, deletes: HCC86"
  );
});

test("Test for CC_diff (CASE 4) ", () => {
  expect(cc_diff()).resolves.toBe("adds: , upgraded: , downgraded: , downgraded_to: , deletes: ");
});
test("Test for CC_diff (CASE 3) ", () => {
  expect(cc_diff("HCC85", "HCC8")).resolves.not.toBe("adds: HCC85, upgraded: , downgraded: , downgraded_to: , deletes: HCC8");
});


// cc_diff_raf
test("Test for CC_DIFF_RAF (CASE 1) ", () => {
  expect(cc_diff_raf("HCC19,HCC27,HCC46,HCC56,HCC86", "HCC17,HCC28,HCC8,HCC46,HCC55", "v23", "CPD")).resolves.toBe("2.103");
});
test("Test for CC_DIFF_RAF (CASE 2) ", () => {
  expect(cc_diff_raf("HCC85", "HCC8", "v23","","", "CFA")).resolves.toBe("2.196");
});
test("Test for CC_DIFF_RAF (CASE 2) ", () => {
  expect(cc_diff_raf()).resolves.toBe("0.000");
});
test("Test for CC_DIFF_RAF (CASE 2) ", () => {
  expect(cc_diff_raf("HCC85", "HCC8", "", "","",0)).resolves.toBe("2.344");
});
test("Test for CC_DIFF_RAF (CASE 3) ", () => {
  expect(cc_diff_raf("HCC85", "HCC18", "v23", "CPD")).resolves.not.toBe("0.196");
});

// cc_INCREMENT_RAF
test("Test for CC_INCREMENT_RAF (CASE 1) ", () => {
  expect(cc_increment_raf("HCC19,HCC56", "HCC17,HCC18,HCC55", "v23", "CPD")).resolves.toBe("0.254");
});
test("Test for CC_INCREMENT_RAF (CASE 2) ", () => {
  expect(cc_increment_raf("HCC85", "HCC8", "v23", "CFA")).resolves.toBe("2.551");
});
test("Test for CC_INCREMENT_RAF (CASE 3) ", () => {
  expect(cc_increment_raf("HCC85", "HCC8", "v23", "CFA")).resolves.not.toBe("1.654");
});
test("Test for CC_INCREMENT_RAF (CASE 3) ", () => {
  expect(cc_increment_raf()).resolves.not.toBe("1.654");
});

// cc_INCREMENT
test("Test for CC_INCREMENT (CASE 1) ", () => {
  expect(cc_increment("HCC19,HCC56", "HCC17,HCC18,HCC55", "v23", "CPD")).resolves.toBe("HCC17,HCC55,-HCC19,-HCC56");
});
test("Test for CC_INCREMENT (CASE 2) ", () => {
  expect(cc_increment("HCC85", "HCC8")).resolves.toBe("HCC8");
});
test("Test for CC_INCREMENT (CASE 3) ", () => {
  expect(cc_increment("HCC19,HCC56,HCC27,HCC46,HCC86", "HCC17,HCC28,HCC55,HCC8,HCC48")).resolves.toBe(
    "HCC8,HCC17,HCC55,-HCC19,-HCC56"
  );
});
test("Test for CC_INCREMENT (CASE 4) ", () => {
  expect(cc_increment("HCC19", "HCC18")).resolves.not.toBe("HCC8");
});
test("Test for CC_INCREMENT (CASE 4) ", () => {
  expect(cc_increment("HCC19", "HCC18")).resolves.not.toBe("HCC8");
});
test("Test for CC_INCREMENT (CASE 4) ", () => {
  expect(cc_increment()).resolves.not.toBe("HCC8");
});

// cc_raf

test("Test for CC_RAF (CASE 3) ", () => {
  expect(cc_raf("HCC8", "v23")).resolves.not.toBe("0.251");
});

//dx_diff
test("Test for DX_DIFF (CASE 1) ", () => {
  expect(dx_diff("E119", "E1111", "v24")).resolves.toBe("adds: E1111, upgraded: E119, downgraded: , downgraded_to: , deletes: ");
});

test("Test for DX_DIFF (CASE 1) ", () => {
  expect(dx_diff()).resolves.toBe("adds: , upgraded: , downgraded: , downgraded_to: , deletes: ");
});
test("Test for DX_DIFF (CASE 1) ", () => {
  expect(dx_diff("E119", "E1111", "v24",0)).resolves.toBe("adds: E1111, upgraded: E119, downgraded: , downgraded_to: , deletes: ");
});

test("Test for DX_DIFF (CASE 1) ", () => {
  expect(dx_diff("E119", "E1111", "v24","CNA")).resolves.toBe("adds: E1111, upgraded: E119, downgraded: , downgraded_to: , deletes: ");
});


//dx_diff_raf
test("Test for DX_DIFF_RAF (CASE 1) ", () => {
  expect(dx_diff_raf("E119", "E1111", "v24")).resolves.toBe("0.197");
});

test("Test for DX_DIFF_RAF (CASE 2) ", () => {
  expect(dx_diff_raf("HCC85", "HCC8", "v23","CFA")).resolves.toBe("0.000");
});
test("Test for DX_DIFF_RAF (CASE 3) ", () => {
  expect(dx_diff_raf()).resolves.toBe("0.000");
});
test("Test for DX_DIFF_RAF (CASE 4) ", () => {
  expect(dx_diff_raf("HCC85", "HCC8", "",0)).resolves.toBe("0.000");
});
// cc_diff_adds Pass Test Cases
test('cc_diff_adds: input: "HCC17,HCC85","HCC18,HCC96" output: "HCC96"', () => {
  expect(cc_diff_adds("HCC17,HCC85", "HCC18,HCC96")).resolves.toBe("HCC96");
});
test('cc_diff_adds: input: "HCC19,HCC56","HCC17,HCC18,HCC55" output: "HCC17,HCC55"', () => {
  expect(cc_diff_adds("HCC19,HCC56", "HCC17,HCC18,HCC55")).resolves.toBe("HCC17,HCC55");
});
test('cc_diff_adds: input: "HCC19,HCC56","HCC17,HCC18,HCC55",never_trump=1 output: "HCC17,HCC18,HCC55"', () => {
  expect(cc_diff_adds("HCC19,HCC56", "HCC17,HCC18,HCC55", "", 0, "", "", "", 1)).resolves.toBe("HCC17,HCC18,HCC55");
});
test('cc_diff_adds: input: "HCC17","HCC85,HCC96" output: "HCC85,HCC96,HCC85,HCC96"', () => {
  expect(cc_diff_adds("HCC17", "HCC85,HCC96")).resolves.toBe("HCC85,HCC96,HCC85_HCC96");
});
// cc_diff_adds Fail Test Cases
test('cc_diff_adds: input: "HCC17,HCC85","HCC18,HCC96" output: "HCC99"', () => {
  expect(cc_diff_adds("HCC17,HCC85", "HCC18,HCC96")).not.toBe("HCC99");
});
test('cc_diff_adds: input: "" output: "HCC99"', () => {
  expect(cc_diff_adds()).not.toBe("HCC99");
});

// cc_diff_adds_raf Pass Test Cases
test('cc_diff_adds_raf: input: "HCC19,HCC85","HCC18" output: "0.201"', () => {
  expect(cc_diff_adds_raf("HCC19,HCC85", "HCC18")).resolves.toBe("0.201");
});
test('cc_diff_adds_raf: input: "HCC19,HCC56","HCC17,HCC18,HCC55" output: "0.201"', () => {
  expect(cc_diff_adds_raf("HCC19,HCC56", "HCC17,HCC18,HCC55")).resolves.toBe("0.201");
});
test('cc_diff_adds_raf: input: "HCC19,HCC56","HCC17,HCC18,HCC55,never_trump=1" output: "0.201"', () => {
  expect(cc_diff_adds_raf("HCC19,HCC56", "HCC17,HCC18,HCC55", "", 0, "", "", "", 1)).resolves.toBe("0.201");
});
test('cc_diff_adds_raf: input: "HCC17","HCC85,HCC96" output: "0.844"', () => {
  expect(cc_diff_adds_raf("HCC17", "HCC85,HCC96")).resolves.toBe("0.844"); 
});
// cc_diff_adds_raf Fail Test Cases
test('cc_diff_adds_raf: input: "HCC19,HCC85","HCC18" output: "0.211"', () => {
  expect(cc_diff_adds_raf("HCC19,HCC85", "HCC18")).not.toBe("0.211");
});
test('cc_diff_adds_raf: input: "" output: "0.211"', () => {
  expect(cc_diff_adds_raf()).not.toBe("0.211");
});
// cc_diff_deletes Pass Test Cases
test('cc_diff_deletes: input: "HCC18,HCC85","HCC17,HCC96" output: "HCC85,HCC85_gDiabetesMellit"', () => {
  expect(cc_diff_deletes("HCC17,HCC85", "HCC18,HCC96")).resolves.toBe("HCC85,HCC85_gDiabetesMellit");
});
// cc_diff_deletes Fail Test Cases
test('cc_diff_deletes: input: "HCC17,HCC85","HCC18,HCC96" output: "HCC85,DIABETES_CHF, HCC85_gDiabetesMellit"', () => {
  expect(cc_diff_deletes("HCC17,HCC85", "HCC18,HCC96")).resolves.not.toBe("HCC85,DIABETES_CHF, HCC85_gDiabetesMellit");
});
test('cc_diff_deletes: input: "" output: "HCC85,DIABETES_CHF, HCC85_gDiabetesMellit"', () => {
  expect(cc_diff_deletes()).resolves.not.toBe("HCC85,DIABETES_CHF, HCC85_gDiabetesMellit");
});
// cc_diff_deletes_raf Pass Test Cases
test('cc_diff_deletes_raf: input: "HCC18,HCC85","HCC19" output: "-0.511"', () => {
  expect(cc_diff_deletes_raf("HCC18,HCC85", "HCC19")).resolves.toBe("-0.511"); 
});
test('cc_diff_deletes_raf: input: "HCC18,HCC85,HCC96",HCC19" output: "-0.511"', () => {
  expect(cc_diff_deletes_raf("HCC18,HCC85,HCC96","HCC19")).resolves.toBe("-0.893");
});
// cc_diff_deletes_raf Fail Test Cases
test('cc_diff_deletes_raf: input: "HCC18,HCC85","HCC19" output: "-0.500"', () => {
  expect(cc_diff_deletes_raf("HCC18,HCC85", "HCC19")).resolves.not.toBe("-0.500"); 
});
test('cc_diff_deletes_raf: input: "" output: "-0.500"', () => {
  expect(cc_diff_deletes_raf()).resolves.not.toBe("-0.500"); 
});
// cc_diff_upgraded Pass Test Cases
test('cc_diff_upgraded: input: "HCC18","HCC17" output: "HCC18"', () => {
  expect(cc_diff_upgraded("HCC18", "HCC17")).resolves.toBe("HCC18");
});
test('cc_diff_upgraded: input: "HCC18,HCC56","HCC17,HCC55" output: "HCC18,HCC56"', () => {
  expect(cc_diff_upgraded("HCC18,HCC56", "HCC17,HCC55")).resolves.toBe("HCC18,HCC56");
});
test('cc_diff_upgraded: input: "HCC18,HCC52","HCC17,HCC51" output: "HCC18"', () => {
  expect(cc_diff_upgraded("HCC18,HCC52", "HCC17,HCC51")).resolves.toBe("HCC18");
});
test('cc_diff_upgraded: input: "HCC18,HCC52","HCC17,HCC51","V24" output: "HCC18,HCC52"', () => {
  expect(cc_diff_upgraded("HCC18,HCC52", "HCC17,HCC51", "v24")).resolves.toBe("HCC18,HCC52");
});
// cc_diff_upgraded Fail Test Cases
test('cc_diff_upgraded: input: "HCC18","HCC17" output: "HCC19"', () => {
  expect(cc_diff_upgraded("HCC18", "HCC17")).resolves.not.toBe("HCC19");
});
test('cc_diff_upgraded: input: "" output: "HCC19"', () => {
  expect(cc_diff_upgraded()).resolves.not.toBe("HCC19");
});
// cc_diff_downgraded Pass Test Cases
test('cc_diff_downgraded: input: "HCC18","HCC17" output: ""', () => {
  expect(cc_diff_downgraded("HCC18", "HCC17")).resolves.toBe("");
});
// cc_diff_downgraded Fail Test Cases
test('cc_diff_downgraded: input: "HCC17","HCC18" output: "HCC99"', () => {
  expect(cc_diff_downgraded("HCC17", "HCC18")).resolves.not.toBe("HCC99");
});
test('cc_diff_downgraded: input: "" output: "HCC99"', () => {
  expect(cc_diff_downgraded()).resolves.not.toBe("HCC99");
});
// cc_diff_downgrade_to Pass Test Cases
test('cc_diff_downgrade_to: input: "HCC17","HCC19" output: "HCC19"', () => {
  expect(cc_diff_downgrade_to("HCC17", "HCC19")).resolves.toBe("HCC19");
});
// cc_diff_downgrade_to Fail Test Cases
test('cc_diff_downgrade_to: input: "HCC17","HCC19" output: "HCC18"', () => {
  expect(cc_diff_downgrade_to("HCC17", "HCC19")).resolves.not.toBe("HCC18");
});
test('cc_diff_downgrade_to: input: " output: "HCC18"', () => {
  expect(cc_diff_downgrade_to()).resolves.not.toBe("HCC18");
});
//dx_acute
//PASS CASE
test("Test for DX_ACUTE (CASE 1) ", () => {
  expect(dx_acute("E119, E1100", "v24")).resolves.toBe("E1100");
});
test("Test for DX_ACUTE (CASE 2) ", () => {
  expect(dx_acute("G6282,G650,G63,G7001", "v24")).resolves.toBe("G6282");
});
test("Test for DX_ACUTE (CASE 3) ", () => {
  expect(dx_acute("E119,E1142,E1100")).resolves.toBe("E1100");
});
//FAIL CASE
test("Test for DX_ACUTE (CASE 4) ", () => {
  expect(dx_acute("E119, E1100", "v24")).resolves.not.toBe("E119");
});
test("Test for DX_ACUTE (CASE 3) ", () => {
  expect(dx_acute()).resolves.not.toBe("E1100");
});
//dx_chronic
//PASS CASE
test("Test for DX_CHRONIC (CASE 1) ", () => {
  expect(dx_chronic("E119, E1100", "v22")).resolves.toBe("E119");
});
test("Test for DX_CHRONIC (CASE 2) ", () => {
  expect(dx_chronic("E119,E1142, E1100", "v24")).resolves.toBe("E119,E1142");
});
test("Test for DX_CHRONIC (CASE 3) ", () => {
  expect(dx_chronic("G6282,G650,G63,G7001")).resolves.toBe("G650,G63");
});

//FAIL CASE
test("Test for DX_CHRONIC (CASE 4) ", () => {
  expect(dx_chronic("E119, E1100", "v22")).resolves.not.toBe("E1100");
});

//cc_acute
//PASS CASE
test("Test for CC_ACUTE (CASE 1) ", () => {
  expect(cc_acute("HCC52,HCC1,HCC169", "v22")).resolves.toBe("HCC169");
});
test("Test for CC_ACUTE (CASE 2) ", () => {
  expect(cc_acute("HCC19,HCC18,HCC17", "v24")).resolves.toBe("HCC17");
});
test("Test for CC_ACUTE (CASE 3) ", () => {
  expect(cc_acute("HCC52,HCC55,HCC169", "v24")).resolves.toBe("HCC169");
});
test("Test for CC_ACUTE (CASE 4) ", () => {
  expect(cc_acute("HCC114,HCC115,HCC138", "v24")).resolves.toBe("HCC114");
});
//FAIL CASE
test("Test for CC_ACUTE (CASE 5) ", () => {
  expect(cc_acute("HCC52,HCC1,HCC169", "v22")).resolves.not.toBe("HCC52");
});

//cc_chronic
//PASS CASE
test("Test for CC_CHRONIC (CASE 1) ", () => {
  expect(cc_chronic("HCC52,HCC1,HCC169", "v23")).resolves.toBe("HCC1");
});
test("Test for CC_CHRONIC (CASE 2) ", () => {
  expect(cc_chronic("HCC114,HCC115,HCC138")).resolves.toBe("HCC138");
});
//FAIL CASE
test("Test for CC_CHRONIC (CASE 3) ", () => {
  expect(cc_chronic("HCC52,HCC1,HCC169", "v23")).resolves.not.toBe("HCC52");
});
//cc_hybrid
//PASS CASE
test("Test for CC_HYBRID (CASE 1) ", () => {
  expect(cc_hybrid("HCC52,HCC1,HCC169", "v24")).resolves.toBe("HCC52");
});
test("Test for CC_HYBRID (CASE 2) ", () => {
  expect(cc_hybrid("HCC19,HCC18,HCC17")).resolves.toBe("HCC19,HCC18");
});
//FAIL CASE
test("Test for CC_HYBRID (CASE 3) ", () => {
  expect(cc_hybrid("HCC52,HCC1,HCC169", "v24")).resolves.not.toBe("HCC169");
});
// TestCase for GetDefaultValue Fail
test("Test for getDefaultValue (CASE 1)",()=>{
  expect(getdefaultvalue("v23,false,true,0,CNA,65,M,868.0,0")).not.toBe("HCC169");
}); 
var ver;
var ver_temp ="v23";
var default_ver;
 var verOb = { ver, ver_temp, default_ver };
  var model;
  var model_temp= "CNA";
  var default_model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var never_trump_temp=1;
  var default_never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disabl_temp=true;
  var default_disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verbose_temp=true;
  var default_verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var age_temp=65;
  var default_age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sex_temp="M";
  var default_sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserate_temp=868.0;
  var default_baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orec_temp=1;
  var default_orec;
  var orecOb = { orec, orec_temp, default_orec };
// TestCase for assignDefaultValues Fail
test("Test for assignDefaultValues (CASE 1)",()=>{
  expect(assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb)).not.toBe("HCC169");
});

var ccs = ['HCC11','HCC47','HCC85','HCC96','HCC18','HCC82','HCC110','HCC134','HCC54','HCC57','HCC58','HCC188','HCC114','HCC57','HCC79'];
var ccsINs = ['HCC11','HCC47','HCC96','HCC18','HCC134','HCC2','HCC54','HCC57','HCC58','HCC188','HCC114','HCC57','HCC157','HCC158'];
//  hcc_gaps Fail Test Cases
test('hcc_gaps: input: "" output: "I281"', () => {
  expect(hcc_gaps()).not.toBe("I281");
});
// dx_gaps Fail Test case
test('dx_gap: input: "" output: ""', () => {
  expect(dx_gap()).not.toBe("");
});
// cc_rafs pass Testcase
test("Test for CC_RAFS (case 2)", () => {
  expect(cc_rafs("HCC1")).toBe("0.344");
});
// dx2raf pass Testcase
test('dx2raf: input: "E119" output: "0.0000"', () => {
  expect(dx2raf("E119")).toBe("0.0000");
});

// dx2hcc Fail TestCase
test('dx2hcc: input: "E119" output: "0.0000"', () => {
  expect(dx2hcc("E119")).not.toBe("0.0000");
});
// dx_hccs Fail TestCase
test('dx_hccs: input: "E119" output: "0.0000"', () => {
  expect(dx_hccs("E119")).not.toBe("0.0000");
});


// clean_dxlist Fail TestCase
test('clean_dxlist: input: "E119" output: "0.0000"', () => {
  expect(clean_dxlist("E119")).not.toBe("0.0000");
});
//
// clean_hcclist Fail TestCase
test('clean_hcclist: input: "E119" output: "0.0000"', () => {
  expect(clean_hcclist("E119")).not.toBe("0.0000");
});


//  hcc2raf TestCase Pass
test("Test for hcc2raf (case 1)", () => {
  expect(hcc2raf("HCC1")).toBe("0.3440");
});
//  prep_hccs TestCase Fail
test("Test for prep_hccs (case 1)", () => {
  expect(prep_hccs("HCC1")).not.toBe("HCC1");
});
//  trump_hccs TestCase Fail
test("Test for trump_hccs (case 1)", () => {
  expect(trump_hccs("HCC1")).not.toBe("HCC1");
}); 
//  hcc_dct TestCase Fail
test("Test for hcc_dct (case 1)", () => {
  expect(hcc_dct("HCC1")).not.toBe("HCC1");
});
test("Test for hcc_dct (case 1)", () => {
  expect(hcc_dct(ccs,"","","","")).not.toBe("HCC1");
});
//  hcc_increment TestCase Fail
test("Test for hcc_increment (case 1)", () => {
  expect(hcc_increment()).not.toBe("");
});
//  dx_increments TestCase Fail
test("Test for dx_increments (case 1)", () => {
  expect(dx_increments()).not.toBe("");
});
//  dx_diffc TestCase Fail
test("Test for dx_diffc (case 1)", () => {
  expect(dx_diffc()).not.toBe("");
});
//  dx_diffc TestCase Fail
test("Test for hcc_diff (case 1)", () => {
  expect(hcc_diff()).not.toBe("");
});
//  member TestCase Fail
test("Test for member (case 1)", () => {
  expect(member("HCC1")).not.toBe("");
});

//  condition_resolver TestCase Fail

test("Test for condition_resolver (case 1)", () => {
  expect(condition_resolver("HCC1")).not.toBe("");
});
//  get_raf TestCase Fail
test("Test for get_raf (case 1)", () => {
  expect(get_raf("HCC1","HCC1")).not.toBe("");
});
//  v22_interactions TestCase 

test("Test for v22_interactions (case 1)", () => {
  expect(v22_interactions(ccs,"CNA",true)).not.toBe("");
});
test("Test for v22_interactions (case 2)", () => {
  expect(v22_interactions(ccs,"INS")).not.toBe("");
});
test("Test for v22_interactions (case 3)", () => {
  expect(v22_interactions(ccsINs,"INS")).not.toBe("");
});
// v23_interactions TestCase
test("Test for v23_interactions (case 1)", () => {
  expect(v23_interactions(ccs,"CNA",true)).not.toBe("");
});
test("Test for v23_interactions (case 2)", () => {
  expect(v23_interactions(ccs,"INS")).not.toBe("");
});
test("Test for v23_interactions (case 3)", () => {
  expect(v23_interactions(ccsINs,"INS")).not.toBe("");
});
// v24_interactions TestCase
test("Test for v24_interactions (case 1)", () => {
  expect(v24_interactions(ccs,"CNA",true)).not.toBe("");
});
test("Test for v24_interactions (case 2)", () => {
  expect(v24_interactions(ccs,"INS")).not.toBe("");
});
test("Test for v24_interactions (case 3)", () => {
  expect(v24_interactions(ccsINs,"INS")).not.toBe("");
});
var name_array =[['MemberName'], ['Mannem Khando'], ['Trupti Chattopadhyay'], ['Mhambrey Kadam'], ['Lahiri Banerjee'], ['Vipin Mistry'], ['Vijayabhas Chattopadhyay'], ['Tamragouri Mehta'], ['Chandrasekaran Sen'], ['Kadowala Goswami']];
var memid_array = [["MemberID",], ['tcO6daqaeb'], ['Z6xaGcvxhc'], ['W2i4MbQKLP'], ['pk1Ttqwkcz'], ['a9nVnnkqvp'], ['K4OE2QR5F5'], ['KoRupvGMs5'], ['xNi9NqYrb4'], ['hlwggy2Ebs'], ];
var chartid_array = [["ChartID",], ['PJke6B5GSH'], ['10c6wxyzRJ'], ['EcqB2vriwf'], ['vSOKuqoGPb'], ['rR8bfKl2Nm'], ['O4CJyKqwVh'], ['TYBcLEVkAT'], ['GlQgC513Hv'], ['D9DMpzZztC'] ];
/* var age_array = [
   [
     "Age",
   ],
   [
     "65",
   ],
   [
     "65",
   ],
   [
   ],
]; */
var age_array = [];
var Gender_array = [["Gender",],["M",],["M",],["M",],["M",],["M",],["M",],["F",],["M",],["M",]];
var DOS_array = [ ['DOS'], ['43169'], ['43468'], ['12-15-2019'], ['11-19-2019'], [''], [''], ['9-25-2018'], ['12-20-2020'], ['7-13-2019']];
var dx_array = [["DX1","DX2","DX3","DX4","Dx5"], ['I10', 'C330', 'F1219', 'S343XXA', 'nan'], ['I675', 'nan', 'nan', 'E7143', 'nan'], ['C50919', 'nan', 'C221', 'nan', 'nan'], ['E1140', 'C330', 'nan', 'S343XXA', 'nan'], ['nan', 'E119', 'B377', 'nan', 'nan'], ['nan', 'C330', 'nan', 'I429', 'I83002'], ['J45909', 'E1151', 'C221', 'M87238', 'nan'], ['nan', 'nan', 'nan', 'nan', 'nan'], ['E1122', 'F330', 'B377', 'nan', 'nan']];
var model_array = [];
/* var model_array = [
 [
   "Model",
 ],
 [
   "CNA",
 ],
 [
   "CNA",
 ],
 [""],
]; */
var name_memid_array = [["MemID",], ['tcO6daqaeb'], ['Z6xaGcvxhc'], ['W2i4MbQKLP'], ['pk1Ttqwkcz'], ['a9nVnnkqvp'], ['K4OE2QR5F5'], ['KoRupvGMs5'], ['xNi9NqYrb4'], ['hlwggy2Ebs'], ];
var name_memid_groupby_array = [[['MemID']],[['MemberName']]];
var memid_cid_name_dos_res = [["memid", "chartid", "name", "dos", "dx", "HCCs", "DemoRAF", "HCCRAF", "TotalRAF"], ["tcO6daqaeb", "PJke6B5GSH", "Mannem Khando", 2018, "I10,C330,F1219,S343XXA", "HCC55,HCC72", "0.301", "0.887", 1.188], ["Z6xaGcvxhc", "10c6wxyzRJ", "Trupti Chattopadhyay", 2019, "I675,E7143", "HCC23", "0.308", "0.194", 0.502], ["W2i4MbQKLP", "EcqB2vriwf", "Mhambrey Kadam", 2019, "C50919,C221", "HCC9", "0.308", "1.024", 1.332], ["pk1Ttqwkcz", "vSOKuqoGPb", "Lahiri Banerjee", 2019, "E1140,C330,S343XXA", "HCC18,HCC72", "0.308", "0.783", 1.091], ["a9nVnnkqvp", "rR8bfKl2Nm", "Vipin Mistry", 1899, "E119,B377", "HCC2,HCC6,HCC19", "0.301", "0.980", 1.281], ["K4OE2QR5F5", "O4CJyKqwVh", "Vijayabhas Chattopadhyay", 1899, "C330,I429,I83002", "HCC85,HCC107", "0.301", "0.711", 1.012], ["KoRupvGMs5", "TYBcLEVkAT", "Tamragouri Mehta", 2018, "J45909,E1151,C221,M87238", "HCC9,HCC18,HCC39,HCC108", "0.316", "2.070", 2.3859999999999997], ["xNi9NqYrb4", "GlQgC513Hv", "Chandrasekaran Sen", 2020,"", "", "0.308", "0.000", 0.308], ["hlwggy2Ebs", "D9DMpzZztC", "Kadowala Goswami", 2019, "E1122,F330,B377", "HCC2,HCC6,HCC18,HCC59", "0.308", "1.387", 1.695]];

var memid_name_res = [
     [
       "memid",
       "name",
       "dos",
       "dx",
       "HCCs",
       "DemoRAF",
       "HCCRAF",
       "TotalRAF",
     ],
     [
       "tcO6daqaeb",
       "Mannem Khando",
       2018,
       "I10,C330,F1219,S343XXA",
       "HCC55,HCC72",
       "0.301",
       "0.887",
       1.188,
     ],
     [
       "Z6xaGcvxhc",
       "Trupti Chattopadhyay",
       2019,
       "I675,E7143",
       "HCC23",
       "0.308",
       "0.194",
       0.502,
     ],
     [
       "W2i4MbQKLP",
       "Mhambrey Kadam",
       2019,
       "C50919,C221",
       "HCC9",
       "0.308",
       "1.024",
       1.332,
     ],
     [
       "pk1Ttqwkcz",
       "Lahiri Banerjee",
       2019,
       "E1140,C330,S343XXA",
       "HCC18,HCC72",
       "0.308",
       "0.783",
       1.091,
     ],
     [
       "a9nVnnkqvp",
       "Vipin Mistry",
       1899,
       "E119,B377",
       "HCC2,HCC6,HCC19",
       "0.301",
       "0.980",
       1.281,
     ],
     [
       "K4OE2QR5F5",
       "Vijayabhas Chattopadhyay",
       1899,
       "C330,I429,I83002",
       "HCC85,HCC107",
       "0.301",
       "0.711",
       1.012,
     ],
     [
       "KoRupvGMs5",
       "Tamragouri Mehta",
       2018,
       "J45909,E1151,C221,M87238",
       "HCC9,HCC18,HCC39,HCC108",
       "0.316",
       "2.070",
       2.3859999999999997,
     ],
     [
       "xNi9NqYrb4",
       "Chandrasekaran Sen",
       2020,
       "",
       "",
       "0.308",
       "0.000",
       0.308,
     ],
     [
       "hlwggy2Ebs",
       "Kadowala Goswami",
       2019,
       "E1122,F330,B377",
       "HCC2,HCC6,HCC18,HCC59",
       "0.308",
       "1.387",
       1.695,
     ],
];
var chartid_memid_array = [["id",],['tcO6daqaeb'],['Z6xaGcvxhc'],['W2i4MbQKLP'],['pk1Ttqwkcz'],['a9nVnnkqvp'],['K4OE2QR5F5'],['KoRupvGMs5'],['xNi9NqYrb4'],['hlwggy2Ebs'],];
var chartid_chartid_memid_array = [["membId",],['tcO6daqaeb'],['Z6xaGcvxhc'],['W2i4MbQKLP'],['pk1Ttqwkcz'],['a9nVnnkqvp'],['K4OE2QR5F5'],['KoRupvGMs5'],['xNi9NqYrb4'],['hlwggy2Ebs'],];
var memid_memid_array = [["id",],['tcO6daqaeb'],['Z6xaGcvxhc'],['W2i4MbQKLP'],['pk1Ttqwkcz'],['a9nVnnkqvp'],['K4OE2QR5F5'],['KoRupvGMs5'],['xNi9NqYrb4'],['hlwggy2Ebs'],];
var memid_groupby_array = [[['id']]];
var memid_res = [
   [
     "memid",
     "name",
     "dos",
     "dx",
     "HCCs",
     "DemoRAF",
     "HCCRAF",
     "TotalRAF",
   ],
   [
     "tcO6daqaeb",
     "Mannem Khando",
     2018,
     "I10,C330,F1219,S343XXA",
     "HCC55,HCC72",
     "0.301",
     "0.887",
     1.188,
   ],
   [
     "Z6xaGcvxhc",
     "Trupti Chattopadhyay",
     2019,
     "I675,E7143",
     "HCC23",
     "0.308",
     "0.194",
     0.502,
   ],
   [
     "W2i4MbQKLP",
     "Mhambrey Kadam",
     2019,
     "C50919,C221",
     "HCC9",
     "0.308",
     "1.024",
     1.332,
   ],
   [
     "pk1Ttqwkcz",
     "Lahiri Banerjee",
     2019,
     "E1140,C330,S343XXA",
     "HCC18,HCC72",
     "0.308",
     "0.783",
     1.091,
   ],
   [
     "a9nVnnkqvp",
     "Vipin Mistry",
     1899,
     "E119,B377",
     "HCC2,HCC6,HCC19",
     "0.301",
     "0.980",
     1.281,
   ],
   [
     "K4OE2QR5F5",
     "Vijayabhas Chattopadhyay",
     1899,
     "C330,I429,I83002",
     "HCC85,HCC107",
     "0.301",
     "0.711",
     1.012,
   ],
   [
     "KoRupvGMs5",
     "Tamragouri Mehta",
     2018,
     "J45909,E1151,C221,M87238",
     "HCC9,HCC18,HCC39,HCC108",
     "0.316",
     "2.070",
     2.3859999999999997,
   ],
   [
     "xNi9NqYrb4",
     "Chandrasekaran Sen",
     2020,
     "",
     "",
     "0.308",
     "0.000",
     0.308,
   ],
   [
     "hlwggy2Ebs",
     "Kadowala Goswami",
     2019,
     "E1122,F330,B377",
     "HCC2,HCC6,HCC18,HCC59",
     "0.308",
     "1.387",
     1.695,
]];
var memid_chartid_groupby_array = [[['membId'],],[['ChartID']]];
var memid_chartid_res = [
  [
    "memid",
    "chartid",
    "name",
    "dos",
    "dx",
    "HCCs",
    "DemoRAF",
    "HCCRAF",
    "TotalRAF",
  ],
  [
    "tcO6daqaeb",
    "PJke6B5GSH",
    "Mannem Khando",
    2018,
    "I10,C330,F1219,S343XXA",
    "HCC55,HCC72",
    "0.301",
    "0.887",
    1.188,
  ],
  [
    "Z6xaGcvxhc",
    "10c6wxyzRJ",
    "Trupti Chattopadhyay",
    2019,
    "I675,E7143",
    "HCC23",
    "0.308",
    "0.194",
    0.502,
  ],
  [
    "W2i4MbQKLP",
    "EcqB2vriwf",
    "Mhambrey Kadam",
    2019,
    "C50919,C221",
    "HCC9",
    "0.308",
    "1.024",
    1.332,
  ],
  [
    "pk1Ttqwkcz",
    "vSOKuqoGPb",
    "Lahiri Banerjee",
    2019,
    "E1140,C330,S343XXA",
    "HCC18,HCC72",
    "0.308",
    "0.783",
    1.091,
  ],
  [
    "a9nVnnkqvp",
    "rR8bfKl2Nm",
    "Vipin Mistry",
    1899,
    "E119,B377",
    "HCC2,HCC6,HCC19",
    "0.301",
    "0.980",
    1.281,
  ],
  [
    "K4OE2QR5F5",
    "O4CJyKqwVh",
    "Vijayabhas Chattopadhyay",
    1899,
    "C330,I429,I83002",
    "HCC85,HCC107",
    "0.301",
    "0.711",
    1.012,
  ],
  [
    "KoRupvGMs5",
    "TYBcLEVkAT",
    "Tamragouri Mehta",
    2018,
    "J45909,E1151,C221,M87238",
    "HCC9,HCC18,HCC39,HCC108",
    "0.316",
    "2.070",
    2.3859999999999997,
  ],
  [
    "xNi9NqYrb4",
    "GlQgC513Hv",
    "Chandrasekaran Sen",
    2020,
    "",
    "",
    "0.308",
    "0.000",
    0.308,
  ],
  [
    "hlwggy2Ebs",
    "D9DMpzZztC",
    "Kadowala Goswami",
    2019,
    "E1122,F330,B377",
    "HCC2,HCC6,HCC18,HCC59",
    "0.308",
    "1.387",
    1.695,
]];
var chartid_dos_groupby_array= [[['ChartID']], [['DOS']]];
var chartid_dos_res = [
    [
      "chartid",
      "dos",
      "name",
      "memid",
      "dx",
      "HCCs",
      "DemoRAF",
      "HCCRAF",
      "TotalRAF",
    ],
    [
      "PJke6B5GSH",
      2018,
      "Mannem Khando",
      "tcO6daqaeb",
      "I10,C330,F1219,S343XXA",
      "HCC55,HCC72",
      "0.301",
      "0.887",
      1.188,
    ],
    [
      "10c6wxyzRJ",
      2019,
      "Trupti Chattopadhyay",
      "Z6xaGcvxhc",
      "I675,E7143",
      "HCC23",
      "0.308",
      "0.194",
      0.502,
    ],
    [
      "EcqB2vriwf",
      2019,
      "Mhambrey Kadam",
      "W2i4MbQKLP",
      "C50919,C221",
      "HCC9",
      "0.308",
      "1.024",
      1.332,
    ],
    [
      "vSOKuqoGPb",
      2019,
      "Lahiri Banerjee",
      "pk1Ttqwkcz",
      "E1140,C330,S343XXA",
      "HCC18,HCC72",
      "0.308",
      "0.783",
      1.091,
    ],
    [
      "rR8bfKl2Nm",
      1899,
      "Vipin Mistry",
      "a9nVnnkqvp",
      "E119,B377",
      "HCC2,HCC6,HCC19",
      "0.301",
      "0.980",
      1.281,
    ],
    [
      "O4CJyKqwVh",
      1899,
      "Vijayabhas Chattopadhyay",
      "K4OE2QR5F5",
      "C330,I429,I83002",
      "HCC85,HCC107",
      "0.301",
      "0.711",
      1.012,
    ],
    [
      "TYBcLEVkAT",
      2018,
      "Tamragouri Mehta",
      "KoRupvGMs5",
      "J45909,E1151,C221,M87238",
      "HCC9,HCC18,HCC39,HCC108",
      "0.316",
      "2.070",
      2.3859999999999997,
    ],
    [
      "GlQgC513Hv",
      2020,
      "Chandrasekaran Sen",
      "xNi9NqYrb4",
      "",
      "",
      "0.308",
      "0.000",
      0.308,
    ],
    [
      "D9DMpzZztC",
      2019,
      "Kadowala Goswami",
      "hlwggy2Ebs",
      "E1122,F330,B377",
      "HCC2,HCC6,HCC18,HCC59",
      "0.308",
      "1.387",
      1.695,
    ],
];
var empty_groupby_array_res = [
  [
    "name",
    "memid",
    "age",
    "gender",
    "model",
    "dos",
    "dx",
    "HCCs",
    "DemoRAF",
    "HCCRAF",
    "TotalRAF",
  ],
  [
    "Mannem Khando",
    "tcO6daqaeb",
    65,
    "M",
    "CNA",
    2018,
    "I10,C330,F1219,S343XXA",
    "HCC55,HCC72",
    "0.301",
    "0.887",
    1.188,
  ],
  [
    "Trupti Chattopadhyay",
    "Z6xaGcvxhc",
    65,
    "M",
    "CNA",
    2019,
    "I675,E7143",
    "HCC23",
    "0.308",
    "0.194",
    0.502,
  ],
  [
    "Mhambrey Kadam",
    "W2i4MbQKLP",
    65,
    "M",
    "CNA",
    2019,
    "C50919,C221",
    "HCC9",
    "0.308",
    "1.024",
    1.332,
  ],
  [
    "Lahiri Banerjee",
    "pk1Ttqwkcz",
    65,
    "M",
    "CNA",
    2019,
    "E1140,C330,S343XXA",
    "HCC18,HCC72",
    "0.308",
    "0.783",
    1.091,
  ],
  [
    "Vipin Mistry",
    "a9nVnnkqvp",
    65,
    "M",
    "CNA",
    1899,
    "E119,B377",
    "HCC2,HCC6,HCC19",
    "0.301",
    "0.980",
    1.281,
  ],
  [
    "Vijayabhas Chattopadhyay",
    "K4OE2QR5F5",
    65,
    "M",
    "CNA",
    1899,
    "C330,I429,I83002",
    "HCC85,HCC107",
    "0.301",
    "0.711",
    1.012,
  ],
  [
    "Tamragouri Mehta",
    "KoRupvGMs5",
    65,
    "F",
    "CNA",
    2018,
    "J45909,E1151,C221,M87238",
    "HCC9,HCC18,HCC39,HCC108",
    "0.316",
    "2.070",
    2.3859999999999997,
  ],
  [
    "Chandrasekaran Sen",
    "xNi9NqYrb4",
    65,
    "M",
    "CNA",
    2020,
    "",
    "",
    "0.308",
    "0.000",
    0.308,
  ],
  [
    "Kadowala Goswami",
    "hlwggy2Ebs",
    65,
    "M",
    "CNA",
    2019,
    "E1122,F330,B377",
    "HCC2,HCC6,HCC18,HCC59",
    "0.308",
    "1.387",
    1.695,
  ],
];
var groupby_array= [[['MemberID']],[['ChartID']],[['MemberName']],[['DOS']]];

var name_array1 = [["MemberName",],["Erik",],["Erik",],];
var memid_array1 = [["MID",],["1",],["1",]];
var chartid_array1 = [[ "ChartID",],[ "11",],[ "12",],];
var age_array1 = [["Age",],["65",],["65",],];
var Gender_array1 = [["Gender",],["M",],["M",],];
var DOS_array1 = [[ "DOS",],[ "43351",],[ "43351",],];
var dx_array1 = [[ "DX1", "DX2", "DX3", "DX4",],[ "E119", "i420", "f330", "d330",],[ "E119", "", "", "",],];
var model_array1 = [[ "Model",],[ "CNA",],[ "CNA",],];

var name_array2 = [[ "MemberName",],[ "Edward",],[ "Bob",],];
var memid_array2 = [[ "MID",],[ "6",],[ "2",],];
var chartid_array2 = [[ "ChartID",],[ "111",],[ "21",],];
var age_array2 = [[ "Age",],[ "65",],[ "42",],];
var Gender_array2 = [[ "Gender",],[ "M",],[ "M",],];
var DOS_array2 = [[ "DOS",],[ "43351",],[ "43351",],];
var dx_array2 = [[ "DX1", "DX2", "DX3", "DX4",],[ "E119", "i420", "f330", "d330",],[ "E119", "", "", "",],];
var model_array2 = [[ "Model",],[ "CNA",],[ "CNA",],];
var groupby_array1 = [[["MemberName",]],[["DOS",]],];
var groupby = [[["ChartID",]]];
var no_header_res = [
  [
    "name",
    "memid",
    "dos",
    "dx",
    "HCCs",
    "DemoRAF",
    "HCCRAF",
    "TotalRAF",
  ],
  [
    "Mannem Khando",
    "tcO6daqaeb",
    2018,
    "I10,C330,F1219,S343XXA",
    "HCC55,HCC72",
    "0.301",
    "0.887",
    1.188,
  ],
  [
    "Trupti Chattopadhyay",
    "Z6xaGcvxhc",
    2019,
    "I675,E7143",
    "HCC23",
    "0.308",
    "0.194",
    0.502,
  ],
  [
    "Mhambrey Kadam",
    "W2i4MbQKLP",
    2019,
    "C50919,C221",
    "HCC9",
    "0.308",
    "1.024",
    1.332,
  ],
  [
    "Lahiri Banerjee",
    "pk1Ttqwkcz",
    2019,
    "E1140,C330,S343XXA",
    "HCC18,HCC72",
    "0.308",
    "0.783",
    1.091,
  ],
  [
    "Vipin Mistry",
    "a9nVnnkqvp",
    1899,
    "E119,B377",
    "HCC2,HCC6,HCC19",
    "0.301",
    "0.980",
    1.281,
  ],
  [
    "Vijayabhas Chattopadhyay",
    "K4OE2QR5F5",
    1899,
    "C330,I429,I83002",
    "HCC85,HCC107",
    "0.301",
    "0.711",
    1.012,
  ],
  [
    "Tamragouri Mehta",
    "KoRupvGMs5",
    2018,
    "J45909,E1151,C221,M87238",
    "HCC9,HCC18,HCC39,HCC108",
    "0.316",
    "2.070",
    2.3859999999999997,
  ],
  [
    "Chandrasekaran Sen",
    "xNi9NqYrb4",
    2020,
    "",
    "",
    "0.308",
    "0.000",
    0.308,
  ],
  [
    "Kadowala Goswami",
    "hlwggy2Ebs",
    2019,
    "E1122,F330,B377",
    "HCC2,HCC6,HCC18,HCC59",
    "0.308",
    "1.387",
    1.695,
  ],
];
var result = [
  [
    "memid",
    "chartid",
    "name",
    "dos",
    "dx",
    "HCCs",
    "DemoRAF",
    "HCCRAF",
    "TotalRAF",
  ],
  [
    "tcO6daqaeb",
    "PJke6B5GSH",
    "Mannem Khando",
    2018,
    "I10,C330,F1219,S343XXA",
    "HCC55,HCC72",
    "0.301",
    "0.887",
    1.188,
  ],
  [
    "Z6xaGcvxhc",
    "10c6wxyzRJ",
    "Trupti Chattopadhyay",
    2019,
    "I675,E7143",
    "HCC23",
    "0.308",
    "0.194",
    0.502,
  ],
  [
    "W2i4MbQKLP",
    "EcqB2vriwf",
    "Mhambrey Kadam",
    2019,
    "C50919,C221",
    "HCC9",
    "0.308",
    "1.024",
    1.332,
  ],
  [
    "pk1Ttqwkcz",
    "vSOKuqoGPb",
    "Lahiri Banerjee",
    2019,
    "E1140,C330,S343XXA",
    "HCC18,HCC72",
    "0.308",
    "0.783",
    1.091,
  ],
  [
    "a9nVnnkqvp",
    "rR8bfKl2Nm",
    "Vipin Mistry",
    1899,
    "E119,B377",
    "HCC2,HCC6,HCC19",
    "0.301",
    "0.980",
    1.281,
  ],
  [
    "K4OE2QR5F5",
    "O4CJyKqwVh",
    "Vijayabhas Chattopadhyay",
    1899,
    "C330,I429,I83002",
    "HCC85,HCC107",
    "0.301",
    "0.711",
    1.012,
  ],
  [
    "KoRupvGMs5",
    "TYBcLEVkAT",
    "Tamragouri Mehta",
    2018,
    "J45909,E1151,C221,M87238",
    "HCC9,HCC18,HCC39,HCC108",
    "0.316",
    "2.070",
    2.3859999999999997,
  ],
  [
    "xNi9NqYrb4",
    "GlQgC513Hv",
    "Chandrasekaran Sen",
    2020,
    "",
    "",
    "0.308",
    "0.000",
    0.308,
  ],
  [
    "hlwggy2Ebs",
    "D9DMpzZztC",
    "Kadowala Goswami",
    2019,
    "E1122,F330,B377",
    "HCC2,HCC6,HCC18,HCC59",
    "0.308",
    "1.387",
    1.695,
  ],
];
var compareresult =[
  [
    "name",
    "dos",
    "memid",
    "age",
    "gender",
    "model_1",
    "dx_1",
    "ver_1",
    "HCCs_1",
    "DemoRAF_1",
    "HCCRAF_1",
    "TotalRAF_1",
    "model_2",
    "dx_2",
    "ver_2",
    "HCCs_2",
    "DemoRAF_2",
    "HCCRAF_2",
    "TotalRAF_2",
    "dx_increment",
    "RAF_increment",
    "RAF_gaps",
    "dx_gaps",
  ],
  [
    "Erik",
    2018,
    "1",
    "65",
    "M",
    "CNA",
    "E119,I420,F330,D330,E119",
    "v23",
    "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
    "0.301",
    "1.074",
    1.375,
    "CNA",
    "E119,I420,F330,D330,E119",
    "v23",
    "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
    "0.301",
    "1.074",
    1.375,
    "",
    "0.000",
    "0.000",
    "",
  ],
];

describe('Testing memprofile with different inputs', () => {
    // memprofile core logic Pass Test Cases
    var new_groupby_array = [[['MemberID']], [['ChartID']], [['MemberName']], [['DOS']]];
    test('memprofile: "User data grouped by MemberName and DOS; Selecting only column headers"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, new_groupby_array)).toMatchObject(result);
    });
    test('memprofile: "User data grouped by MemberName and DOS"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, groupby_array)).toMatchObject(result);
    });
    test('memprofile: "User data grouped by memid, CID, name and DOS"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, groupby_array)).toMatchObject(memid_cid_name_dos_res);
    });
    test('memprofile: "User data grouped by memid, name"', () => {
        expect(memprofile(name_array, name_memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, name_memid_groupby_array)).toMatchObject(memid_name_res);
    });
    test('memprofile: "User data grouped by memid"', () => {
        expect(memprofile(name_array, memid_memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, memid_groupby_array)).toMatchObject(memid_res);
    });
    test('memprofile: "User data grouped by memid, chartid"', () => {
        expect(memprofile(name_array, chartid_chartid_memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, memid_chartid_groupby_array)).toMatchObject(memid_chartid_res);
    });
    test('memprofile: "User data grouped by dos, chartid"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, chartid_dos_groupby_array)).toMatchObject(chartid_dos_res);
    });
    test('memprofile: "User data when groupby_array is not provided and default grouping with name, memid, age, gender, model, dos"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true)).toMatchObject(empty_groupby_array_res);
    });
    test('memprofile: "User data when hasHeader is false and default grouping with name, memid"', () => {
        expect(memprofile(name_array.slice(1), memid_array.slice(1), chartid_array.slice(1), age_array.slice(1), Gender_array.slice(1), DOS_array.slice(1), dx_array.slice(1), model_array.slice(1), hasHeader = false, name_memid_groupby_array)).toMatchObject(no_header_res);
    });
    // memprofile core logic Fail Test Cases
    test('memprofile: "User data grouped by MemberName and DOS is not an empty array"', () => {
        expect(memprofile(name_array, memid_array, chartid_array, age_array, Gender_array, DOS_array, dx_array, model_array, hasHeader = true, groupby)).not.toBe(['']);
    });
});

describe('Testing dx_profile_compare', () => {
  var name1 = [["MemberName"],["Erik",],["Bob",],["Bob"],["Tom"],["Mark"],["Jane"], ["Greg"]],
    mid1 = [["MemberID"],["1"],["2"],["2"],["3"], ["4"], ["5"], ["7"]],
    cid1 = [["ChartID"],["11"],["21"],["23"],["24"], ["31"], ["41"], ["27"]],
    age1 = [["Age"],["65"],["42"],["41"],["59"], ["74"], ["75"], ["56"]],
    gender1 = [["Gender"],["M"],["M"],["M"],["F"], ["M"], ["F"], [""]],
    dos1 = [["DOS"],["04-02-2018"],["04-01-2019"],["05-02-2018"],["08-09-2018"], ["04-01-2019"], ["06-01-2019"], ["07-07-2017"]],
    model1 = [["Model"],["CNA"],["CPD"],["CPD"],["CFD"], ["INS"], ["CFA"], ["MDL"]],
    dx1 = [["DX1","DX2","DX3","DX4",],["E119","i420","f330","d330",], ["D330","","",""], ["E119","","","",], ["i420","","","",], ["E119","","","",], ["e119","","","",], ["e119","","","",]],
    name2 = [["MemberName"],["Edward",],["Bob",],["Bob"],["Tom"],["Mark"],["Jane"]],
    mid2 = [["MemberID"],["6"],["2"],["2"],["3"], ["4"], ["5"]],
    cid2 = [["ChartID"],["111"],["21"],["23"],["24"], ["31"], ["41"]],
    age2 = [["Age"],["65"],["42"],["41"],["59"], ["74"], ["75"]],
    gender2 = [["Gender"],["M"],["M"],["M"],["F"], ["M"], ["F"]],
    dos2 = [["DOS"],["04-01-2018"],["04-01-2019"],["05-02-2018"],["08-09-2018"], ["04-01-2019"], ["06-01-2019"],],
    model2 = [["Model"],["CNA"],["CPD"],["CPD"],["CFD"], ["INS"], ["CFA"]],
    dx2 = [["DX1","DX2","DX3","DX4",],["s119","f330","e330",], ["D330","","",""], ["E119","","","",], ["i420","","","",], ["E119","","","",], ["e119","","","",]],
    groupby_memid_cid_mName_dos = [[['MemberID']], [['ChartID']], [['MemberName']], [['DOS']]],
    groupby_name_memid = [[['MemberID']], [['MemberName']]],
    groupby_memid = [[['MemberID']]],
    groupby_name = [[['MemberName']]],
    groupby_dos = [[['DOS']]],
    groupby_name_dos = [[['MemberName']], [['DOS']]],
    dx_comp_memid_res = [
        [
          "memid",
          "name",
          "age",
          "gender",
          "dos_1",
          "model_1",
          "dx_1",
          "ver_1",
          "HCCs_1",
          "DemoRAF_1",
          "HCCRAF_1",
          "TotalRAF_1",
          "dos_2",
          "model_2",
          "dx_2",
          "ver_2",
          "HCCs_2",
          "DemoRAF_2",
          "HCCRAF_2",
          "TotalRAF_2",
          "dx_increment",
          "RAF_increment",
          "RAF_gaps",
          "dx_gaps",
        ],
        [
          "2",
          "Bob",
          "42",
          "M",
          2019,
          "CPD",
          "D330,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          2019,
          "CPD",
          "D330,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "3",
          "Tom",
          "59",
          "F",
          2018,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          2018,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "4",
          "Mark",
          "74",
          "M",
          2019,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          2019,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "5",
          "Jane",
          "75",
          "F",
          2019,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          2019,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "6",
          "Edward",
          "65",
          "M",
          2018,
          "CNA",
          "S119,F330,E330",
          "v23",
          "HCC59",
          "0.301",
          "0.353",
          0.6539999999999999,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "0.000",
          "-0.353",
          "F330",
        ],
        [
          "1",
          "Erik",
          "65",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          2018,
          "CNA",
          "E119,I420,F330,D330",
          "v23",
          "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
          "0.301",
          "1.074",
          1.375,
          "E119,I420,F330,D330",
          "1.074",
          "0.000",
          "",
        ],
        [
          "7",
          "Greg",
          "56",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          2017,
          "MDL",
          "E119",
          "v22",
          "HCC19",
          "0.000",
          "0.000",
          0,
          "E119",
          "0.000",
          "0.000",
          "",
        ],
    ],
    dx_comp_memid_cid_mName_dos_res = [
        [
          "memid",
          "chartid",
          "name",
          "dos",
          "age",
          "gender",
          "model_1",
          "dx_1",
          "ver_1",
          "HCCs_1",
          "DemoRAF_1",
          "HCCRAF_1",
          "TotalRAF_1",
          "model_2",
          "dx_2",
          "ver_2",
          "HCCs_2",
          "DemoRAF_2",
          "HCCRAF_2",
          "TotalRAF_2",
          "dx_increment",
          "RAF_increment",
          "RAF_gaps",
          "dx_gaps",
        ],
        [
          "6",
          "111",
          "Edward",
          2018,
          "65",
          "M",
          "CNA",
          "S119,F330,E330",
          "v23",
          "HCC59",
          "0.301",
          "0.353",
          0.6539999999999999,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "0.000",
          "-0.353",
          "F330",
        ],
        [
          "2",
          "21,21",
          "Bob",
          2019,
          "42",
          "M",
          "CPD",
          "D330",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "CPD",
          "D330",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "2",
          "23,23",
          "Bob",
          2018,
          "41",
          "M",
          "CPD",
          "E119",
          "v23",
          "HCC19",
          "0.258",
          "0.125",
          0.383,
          "CPD",
          "E119",
          "v23",
          "HCC19",
          "0.258",
          "0.125",
          0.383,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "3",
          "24,24",
          "Tom",
          2018,
          "59",
          "F",
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "4",
          "31,31",
          "Mark",
          2019,
          "74",
          "M",
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "5",
          "41,41",
          "Jane",
          2019,
          "75",
          "F",
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "1",
          "11",
          "Erik",
          2018,
          "65",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "CNA",
          "E119,I420,F330,D330",
          "v23",
          "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
          "0.301",
          "1.074",
          1.375,
          "E119,I420,F330,D330",
          "1.074",
          "0.000",
          "",
        ],
        [
          "7",
          "27",
          "Greg",
          2017,
          "56",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "MDL",
          "E119",
          "v22",
          "HCC19",
          "0.000",
          "0.000",
          0,
          "E119",
          "0.000",
          "0.000",
          "",
        ],
    ],
    dx_comp_name_memid_res = [
        [
          "memid",
          "name",
          "age",
          "gender",
          "dos_1",
          "model_1",
          "dx_1",
          "ver_1",
          "HCCs_1",
          "DemoRAF_1",
          "HCCRAF_1",
          "TotalRAF_1",
          "dos_2",
          "model_2",
          "dx_2",
          "ver_2",
          "HCCs_2",
          "DemoRAF_2",
          "HCCRAF_2",
          "TotalRAF_2",
          "dx_increment",
          "RAF_increment",
          "RAF_gaps",
          "dx_gaps",
        ],
        [
          "6",
          "Edward",
          "65",
          "M",
          2018,
          "CNA",
          "S119,F330,E330",
          "v23",
          "HCC59",
          "0.301",
          "0.353",
          0.6539999999999999,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "0.000",
          "-0.353",
          "F330",
        ],
        [
          "2",
          "Bob",
          "42",
          "M",
          2019,
          "CPD",
          "D330,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          2019,
          "CPD",
          "D330,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "3",
          "Tom",
          "59",
          "F",
          2018,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          2018,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "4",
          "Mark",
          "74",
          "M",
          2019,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          2019,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "5",
          "Jane",
          "75",
          "F",
          2019,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          2019,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "1",
          "Erik",
          "65",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          2018,
          "CNA",
          "E119,I420,F330,D330",
          "v23",
          "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
          "0.301",
          "1.074",
          1.375,
          "E119,I420,F330,D330",
          "1.074",
          "0.000",
          "",
        ],
        [
          "7",
          "Greg",
          "56",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          2017,
          "MDL",
          "E119",
          "v22",
          "HCC19",
          "0.000",
          "0.000",
          0,
          "E119",
          "0.000",
          "0.000",
          "",
        ],
    ],
    dx_comp_dos_res = [
        [
          "dos",
          "age",
          "gender",
          "name_1",
          "memid_1",
          "model_1",
          "dx_1",
          "ver_1",
          "HCCs_1",
          "DemoRAF_1",
          "HCCRAF_1",
          "TotalRAF_1",
          "name_2",
          "memid_2",
          "model_2",
          "dx_2",
          "ver_2",
          "HCCs_2",
          "DemoRAF_2",
          "HCCRAF_2",
          "TotalRAF_2",
          "dx_increment",
          "RAF_increment",
          "RAF_gaps",
          "dx_gaps",
        ],
        [
          2018,
          "65",
          "M",
          "Erik",
          "1",
          "CNA",
          "E119,I420,F330,D330,E119,I420",
          "v23",
          "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
          "0.301",
          "1.074",
          1.375,
          "Edward",
          "6",
          "CNA",
          "S119,F330,E330,E119,I420",
          "v23",
          "HCC59",
          "0.301",
          "0.353",
          0.6539999999999999,
          "",
          "0.000",
          "-0.153",
          "D330",
        ],
        [
          2019,
          "42",
          "M",
          "Bob",
          "2",
          "CPD",
          "D330,E119,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "Bob",
          "2",
          "CPD",
          "D330,E119,E119",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          2017,
          "56",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "Greg",
          "7",
          "MDL",
          "E119",
          "v22",
          "HCC19",
          "0.000",
          "0.000",
          0,
          "E119",
          "0.000",
          "0.000",
          "",
        ],
    ],
    dx_comp_no_groupby_res = [
        [
          "name",
          "memid",
          "dos",
          "age",
          "gender",
          "model_1",
          "dx_1",
          "ver_1",
          "HCCs_1",
          "DemoRAF_1",
          "HCCRAF_1",
          "TotalRAF_1",
          "model_2",
          "dx_2",
          "ver_2",
          "HCCs_2",
          "DemoRAF_2",
          "HCCRAF_2",
          "TotalRAF_2",
          "dx_increment",
          "RAF_increment",
          "RAF_gaps",
          "dx_gaps",
        ],
        [
          "Edward",
          "6",
          2018,
          "65",
          "M",
          "CNA",
          "S119,F330,E330",
          "v23",
          "HCC59",
          "0.301",
          "0.353",
          0.6539999999999999,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "0.000",
          "-0.353",
          "F330",
        ],
        [
          "Bob",
          "2",
          2019,
          "42",
          "M",
          "CPD",
          "D330",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "CPD",
          "D330",
          "v24",
          "HCC12",
          "0.282",
          "0.181",
          0.46299999999999997,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "Bob",
          "2",
          2018,
          "41",
          "M",
          "CPD",
          "E119",
          "v23",
          "HCC19",
          "0.258",
          "0.125",
          0.383,
          "CPD",
          "E119",
          "v23",
          "HCC19",
          "0.258",
          "0.125",
          0.383,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "Tom",
          "3",
          2018,
          "59",
          "F",
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "CFD",
          "I420",
          "v23",
          "HCC85",
          "0.404",
          "0.441",
          0.845,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "Mark",
          "4",
          2019,
          "74",
          "M",
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "INS",
          "E119",
          "v24",
          "HCC19",
          "1.329",
          "0.178",
          1.507,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "Jane",
          "5",
          2019,
          "75",
          "F",
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "CFA",
          "E119",
          "v24",
          "HCC19",
          "0.593",
          "0.107",
          0.7,
          "",
          "0.000",
          "0.000",
          "",
        ],
        [
          "Erik",
          "1",
          2018,
          "65",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "CNA",
          "E119,I420,F330,D330",
          "v23",
          "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
          "0.301",
          "1.074",
          1.375,
          "E119,I420,F330,D330",
          "1.074",
          "0.000",
          "",
        ],
        [
          "Greg",
          "7",
          2017,
          "56",
          "M",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "MDL",
          "E119",
          "v22",
          "HCC19",
          "0.000",
          "0.000",
          0,
          "E119",
          "0.000",
          "0.000",
          "",
        ],
    ],
    dx_comp_memid_cid_mName_dos_unequal_users_res = [
      [
        "memid",
        "chartid",
        "name",
        "dos",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "dx_increment",
        "RAF_increment",
        "RAF_gaps",
        "dx_gaps",
      ],
      [
        "1",
        "11",
        "Erik",
        2018,
        "65",
        "M",
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "0.000",
        "-1.074",
        "E119,I420,F330,D330",
      ],
      [
        "2",
        "21,21",
        "Bob",
        2019,
        "42",
        "M",
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "2",
        "23,23",
        "Bob",
        2018,
        "41",
        "M",
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "3",
        "24,24",
        "Tom",
        2018,
        "59",
        "F",
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "4",
        "31,31",
        "Mark",
        2019,
        "74",
        "M",
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "5",
        "41,41",
        "Jane",
        2019,
        "75",
        "F",
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "7",
        "27",
        "Greg",
        2017,
        "56",
        "M",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "0.000",
        "0.000",
        "E119",
      ],
      [
        "6",
        "111",
        "Edward",
        2018,
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "F330",
        "0.353",
        "0.000",
        "",
      ],
    ],
    dx_comp_name_dos_res = [
      [
        "name",
        "dos",
        "memid",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "dx_increment",
        "RAF_increment",
        "RAF_gaps",
        "dx_gaps",
      ],
      [
        "Edward",
        2018,
        "6",
        "65",
        "M",
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "0.000",
        "-0.353",
        "F330",
      ],
      [
        "Bob",
        2019,
        "2",
        "42",
        "M",
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "Bob",
        2018,
        "2",
        "41",
        "M",
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "Tom",
        2018,
        "3",
        "59",
        "F",
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "Mark",
        2019,
        "4",
        "74",
        "M",
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "Jane",
        2019,
        "5",
        "75",
        "F",
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        "0.000",
        "0.000",
        "",
      ],
      [
        "Erik",
        2018,
        "1",
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "E119,I420,F330,D330",
        "1.074",
        "0.000",
        "",
      ],
      [
        "Greg",
        2017,
        "7",
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "E119",
        "0.000",
        "0.000",
        "",
      ],
    ];
    // dx_profile_compare Pass Test Cases
    test('dx_profile_compare grouped by memid, cid, mName, dos with unequal users', () => {
      expect(dx_profile_compare(name2, mid2, cid2, age2, gender2, dos2, dx2, model2, name1, mid1, cid1, age1, gender1, dos1, dx1, model1, hasHeader = true, isGrouped = true, groupby_memid_cid_mName_dos)).toMatchObject(dx_comp_memid_cid_mName_dos_unequal_users_res);
    });

    test('dx_profile_compare grouped by memid, cid, mName, dos', () => {
        expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = true, groupby_memid_cid_mName_dos)).toMatchObject(dx_comp_memid_cid_mName_dos_res);
    });

    test('dx_profile_compare grouped by memid, mName', () => {
        expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_name_memid)).toMatchObject(dx_comp_name_memid_res);
    });

    test('dx_profile_compare grouped by memid', () => {
        expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_memid)).toMatchObject(dx_comp_memid_res);
    });

    test('dx_profile_compare grouped by dos', () => {
        expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_dos)).toMatchObject(dx_comp_dos_res);
    });

    test('dx_profile_compare grouped by name, dos', () => {
      expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_name_dos)).toMatchObject(dx_comp_name_dos_res);
  });

    test('dx_profile_compare without groupby', () => {
        expect(dx_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false,)).toMatchObject(dx_comp_no_groupby_res);
    });

    test('dx_profile_compare: "User data with non-grouped data"', () => {
       expect(dx_profile_compare(name_array1, memid_array1, chartid_array1, age_array1, Gender_array1, DOS_array1, dx_array1, model_array1,name_array1, memid_array1, chartid_array1, age_array1, Gender_array1, DOS_array1, dx_array1, model_array1, hasHeader = true, isGrouped = false, groupby_array1)).toMatchObject(compareresult);
    });
    
    // dx_profile_compare Fail Test Case
    test('dx_profile_compare: "User data grouped by MemberName and DOS is not an empty array"', () => {
       expect(dx_profile_compare(name_array1, memid_array1, chartid_array1, age_array1, Gender_array1, DOS_array1, dx_array1, model_array1, name_array2, memid_array2, chartid_array2, age_array2, Gender_array2, DOS_array2, dx_array2, model_array2, isGrouped = true)).not.toBe(['']);
    });
});
var hcc_comp_memid_cid_mName_dos_unequal_users_res = [];
describe('Testing hcc_profile_compare', () => {
  var name1 = [["MemberName"],["Erik",],["Bob",],["Bob"],["Tom"],["Mark"],["Jane"], ["Greg"]],
    mid1 = [["MemberID"],["1"],["2"],["2"],["3"], ["4"], ["5"], ["7"]],
    cid1 = [["ChartID"],["11"],["21"],["23"],["24"], ["31"], ["41"], ["27"]],
    age1 = [["Age"],["65"],["42"],["41"],["59"], ["74"], ["75"], ["56"]],
    gender1 = [["Gender"],["M"],["M"],["M"],["F"], ["M"], ["F"], [""]],
    dos1 = [["DOS"],["04-02-2018"],["04-01-2019"],["05-02-2018"],["08-09-2018"], ["04-01-2019"], ["06-01-2019"], ["07-07-2017"]],
    model1 = [["Model"],["CNA"],["CPD"],["CPD"],["CFD"], ["INS"], ["CFA"], ["MDL"]],
    dx1 = [["DX1","DX2","DX3","DX4",],["E119","i420","f330","d330",], ["D330","","",""], ["E119","","","",], ["i420","","","",], ["E119","","","",], ["e119","","","",], ["e119","","","",]],
    name2 = [["MemberName"],["Edward",],["Bob",],["Bob"],["Tom"],["Mark"],["Jane"]],
    mid2 = [["MemberID"],["6"],["2"],["2"],["3"], ["4"], ["5"]],
    cid2 = [["ChartID"],["111"],["21"],["23"],["24"], ["31"], ["41"]],
    age2 = [["Age"],["65"],["42"],["41"],["59"], ["74"], ["75"]],
    gender2 = [["Gender"],["M"],["M"],["M"],["F"], ["M"], ["F"]],
    dos2 = [["DOS"],["04-01-2018"],["04-01-2019"],["05-02-2018"],["08-09-2018"], ["04-01-2019"], ["06-01-2019"],],
    model2 = [["Model"],["CNA"],["CPD"],["CPD"],["CFD"], ["INS"], ["CFA"]],
    dx2 = [["DX1","DX2","DX3","DX4",],["s119","f330","e330",], ["D330","","",""], ["E119","","","",], ["i420","","","",], ["E119","","","",], ["e119","","","",]],
    groupby_memid_cid_mName_dos = [[['MemberID']], [['ChartID']], [['MemberName']], [['DOS']]],
    groupby_name_memid = [[['MemberID']], [['MemberName']]],
    groupby_memid = [[['MemberID']]],
    groupby_name = [[['MemberName']]],
    groupby_dos = [[['DOS']]],
    groupby_name_dos = [[['MemberName']], [['DOS']]],
    hcc_comp_memid_cid_mName_dos_unequal_users_res = [
      [
        "memid",
        "chartid",
        "name",
        "dos",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "1",
        "11",
        "Erik",
        2018,
        "65",
        "M",
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "2",
        "21,21",
        "Bob",
        2019,
        "42",
        "M",
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        "2",
        "23,23",
        "Bob",
        2018,
        "41",
        "M",
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "",
        0,
        "",
        0,
      ],
      [
        "3",
        "24,24",
        "Tom",
        2018,
        "59",
        "F",
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        0,
        "",
        0,
      ],
      [
        "4",
        "31,31",
        "Mark",
        2019,
        "74",
        "M",
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        0,
        "",
        0,
      ],
      [
        "5",
        "41,41",
        "Jane",
        2019,
        "75",
        "F",
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        0,
        "",
        0,
      ],
      [
        "7",
        "27",
        "Greg",
        2017,
        "56",
        "M",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "6",
        "111",
        "Edward",
        2018,
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_memid_cid_mName_dos_res = [
      [
        "memid",
        "chartid",
        "name",
        "dos",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "6",
        "111",
        "Edward",
        2018,
        "65",
        "M",
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "2",
        "21,21",
        "Bob",
        2019,
        "42",
        "M",
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        "2",
        "23,23",
        "Bob",
        2018,
        "41",
        "M",
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "",
        0,
        "",
        0,
      ],
      [
        "3",
        "24,24",
        "Tom",
        2018,
        "59",
        "F",
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        0,
        "",
        0,
      ],
      [
        "4",
        "31,31",
        "Mark",
        2019,
        "74",
        "M",
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        0,
        "",
        0,
      ],
      [
        "5",
        "41,41",
        "Jane",
        2019,
        "75",
        "F",
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        0,
        "",
        0,
      ],
      [
        "1",
        "11",
        "Erik",
        2018,
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        0,
        "",
        0,
      ],
      [
        "7",
        "27",
        "Greg",
        2017,
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_name_memid_res = [
      [
        "memid",
        "name",
        "age",
        "gender",
        "dos_1",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "dos_2",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "6",
        "Edward",
        "65",
        "M",
        2018,
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "2",
        "Bob",
        "42",
        "M",
        2019,
        "CPD",
        "D330,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        2019,
        "CPD",
        "D330,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        "3",
        "Tom",
        "59",
        "F",
        2018,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        2018,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        0,
        "",
        0,
      ],
      [
        "4",
        "Mark",
        "74",
        "M",
        2019,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        2019,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        0,
        "",
        0,
      ],
      [
        "5",
        "Jane",
        "75",
        "F",
        2019,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        2019,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        0,
        "",
        0,
      ],
      [
        "1",
        "Erik",
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        2018,
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        0,
        "",
        0,
      ],
      [
        "7",
        "Greg",
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        2017,
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_memid_res = [
      [
        "memid",
        "name",
        "age",
        "gender",
        "dos_1",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "dos_2",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "2",
        "Bob",
        "42",
        "M",
        2019,
        "CPD",
        "D330,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        2019,
        "CPD",
        "D330,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        "3",
        "Tom",
        "59",
        "F",
        2018,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        2018,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        0,
        "",
        0,
      ],
      [
        "4",
        "Mark",
        "74",
        "M",
        2019,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        2019,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        0,
        "",
        0,
      ],
      [
        "5",
        "Jane",
        "75",
        "F",
        2019,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        2019,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        0,
        "",
        0,
      ],
      [
        "6",
        "Edward",
        "65",
        "M",
        2018,
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "1",
        "Erik",
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        2018,
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        0,
        "",
        0,
      ],
      [
        "7",
        "Greg",
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        2017,
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_dos_res = [
      [
        "dos",
        "age",
        "gender",
        "name_1",
        "memid_1",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "name_2",
        "memid_2",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        2018,
        "65",
        "M",
        "Erik",
        "1",
        "CNA",
        "E119,I420,F330,D330,E119,I420",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "Edward",
        "6",
        "CNA",
        "S119,F330,E330,E119,I420",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        0,
        "",
        0,
      ],
      [
        2019,
        "42",
        "M",
        "Bob",
        "2",
        "CPD",
        "D330,E119,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "Bob",
        "2",
        "CPD",
        "D330,E119,E119",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        2017,
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Greg",
        "7",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_no_groupby_res = [
      [
        "name",
        "memid",
        "dos",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "Edward",
        "6",
        2018,
        "65",
        "M",
        "CNA",
        "S119,F330,E330",
        "v23",
        "HCC59",
        "0.301",
        "0.353",
        0.6539999999999999,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        0,
        "",
        0,
      ],
      [
        "Bob",
        "2",
        2019,
        "42",
        "M",
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "CPD",
        "D330",
        "v24",
        "HCC12",
        "0.282",
        "0.181",
        0.46299999999999997,
        "",
        0,
        "",
        0,
      ],
      [
        "Bob",
        "2",
        2018,
        "41",
        "M",
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "CPD",
        "E119",
        "v23",
        "HCC19",
        "0.258",
        "0.125",
        0.383,
        "",
        0,
        "",
        0,
      ],
      [
        "Tom",
        "3",
        2018,
        "59",
        "F",
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "CFD",
        "I420",
        "v23",
        "HCC85",
        "0.404",
        "0.441",
        0.845,
        "",
        0,
        "",
        0,
      ],
      [
        "Mark",
        "4",
        2019,
        "74",
        "M",
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "INS",
        "E119",
        "v24",
        "HCC19",
        "1.329",
        "0.178",
        1.507,
        "",
        0,
        "",
        0,
      ],
      [
        "Jane",
        "5",
        2019,
        "75",
        "F",
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "CFA",
        "E119",
        "v24",
        "HCC19",
        "0.593",
        "0.107",
        0.7,
        "",
        0,
        "",
        0,
      ],
      [
        "Erik",
        "1",
        2018,
        "65",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CNA",
        "E119,I420,F330,D330",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        0,
        "",
        0,
      ],
      [
        "Greg",
        "7",
        2017,
        "56",
        "M",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "MDL",
        "E119",
        "v22",
        "HCC19",
        "0.000",
        "0.000",
        0,
        "",
        0,
        "",
        0,
      ],
    ],
    hcc_comp_name_dos_res = [
      [
        "name",
        "dos",
        "memid",
        "age",
        "gender",
        "model_1",
        "dx_1",
        "ver_1",
        "HCCs_1",
        "DemoRAF_1",
        "HCCRAF_1",
        "TotalRAF_1",
        "model_2",
        "dx_2",
        "ver_2",
        "HCCs_2",
        "DemoRAF_2",
        "HCCRAF_2",
        "TotalRAF_2",
        "hcc_increment",
        "hcc_increment_raf",
        "hcc_gaps",
        "hcc_gaps_raf",
      ],
      [
        "Erik",
        2018,
        "1",
        "65",
        "M",
        "CNA",
        "E119,I420,F330,D330,E119",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "CNA",
        "E119,I420,F330,D330,E119",
        "v23",
        "HCC12,HCC19,HCC59,HCC85,HCC85_gDiabetesMellit",
        "0.301",
        "1.074",
        1.375,
        "",
        0,
        "",
        0,
      ],
    ];
  test('hcc_profile_compare grouped by memid, cid, mName, dos with unequal users', () => {
    expect(hcc_profile_compare(name2, mid2, cid2, age2, gender2, dos2, dx2, model2, name1, mid1, cid1, age1, gender1, dos1, dx1, model1, hasHeader = true, isGrouped = true, groupby_memid_cid_mName_dos)).toMatchObject(hcc_comp_memid_cid_mName_dos_unequal_users_res);
  });
  test('hcc_profile_compare grouped by memid, cid, mName, dos', () => {
    expect(hcc_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = true, groupby_memid_cid_mName_dos)).toMatchObject(hcc_comp_memid_cid_mName_dos_res);
});

test('hcc_profile_compare grouped by memid, mName', () => {
    expect(hcc_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_name_memid)).toMatchObject(hcc_comp_name_memid_res);
});

test('hcc_profile_compare grouped by memid', () => {
    expect(hcc_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_memid)).toMatchObject(hcc_comp_memid_res);
});

test('hcc_profile_compare grouped by dos', () => {
    expect(hcc_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false, groupby_dos)).toMatchObject(hcc_comp_dos_res);
});

test('hcc_profile_compare without groupby', () => {
    expect(hcc_profile_compare(name1, mid1, cid1, age1, gender1, dos1, dx1, model1, name2, mid2, cid2, age2, gender2, dos2, dx2, model2, hasHeader = true, isGrouped = false,)).toMatchObject(hcc_comp_no_groupby_res);
});

test('hcc_profile_compare: "User data grouped by MemberName and DOS"', () => {
   expect(hcc_profile_compare(name_array1, memid_array1, chartid_array1, age_array1, Gender_array1, DOS_array1, dx_array1, model_array1,name_array1, memid_array1, chartid_array1, age_array1, Gender_array1, DOS_array1, dx_array1, model_array1, hasHeader = true, isGrouped = false, groupby_array1)).toMatchObject(hcc_comp_name_dos_res);
});

  // hcc_profile_compare Fail Test Case
  test('hcc_profile_compare: "User data grouped by memid, cid, mName, dos with unequal users"', () => {
    expect(hcc_profile_compare(name2, mid2, cid2, age2, gender2, dos2, dx2, model2, name1, mid1, cid1, age1, gender1, dos1, dx1, model1, hasHeader = true, isGrouped = true, groupby_memid_cid_mName_dos)).not.toBe(['']);
 });
});