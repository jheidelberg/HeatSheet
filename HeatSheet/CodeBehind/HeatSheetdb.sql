
CREATE TABLE "CastData" (
    "DATE" TEXT,
    "HEAT" INTEGER,
    "TAP" INTEGER,
    "MATLPOURED" INTEGER,
    "FLOOR" TEXT,
    "AC_BHN" INTEGER,
    "HT_METHOD" TEXT,
    "AHT_BHN" TEXT,
    "CUSTOMER" TEXT,
    "PIECES_MADE" TEXT
); 

CREATE TABLE "TapData" (
DATE text,
HEAT integer,
TAP integer,
MATERIAL text,
FURN_NO integer,
TIME text,
AMT integer,
CMG_WIRE integer,
FESI integer,
POUR_BACK integer,
PIGGED integer,
INOC63 integer,
CU integer,
MN integer,
CR integer,
NI integer,
PHOS integer,
I_PYRITE integer,
B_TEMP integer,
E_TEMP integer,
M_PTIME integer,
L_PTIME integer,
NOTES text,
MO integer
);

CREATE TABLE "ChemData"(
DATE TEXT,
HEAT TEXT,
TAP TEXT,
C INTEGER,
SI INTEGER,
MN INTEGER,
PH INTEGER,
S INTEGER,
CR INTEGER,
MO INTEGER,
NI INTEGER,
AL INTEGER,
CU INTEGER,
TI INTEGER,
V INTEGER,
PB INTEGER,
SN INTEGER,
MG INTEGER
);

CREATE TABLE "ChgData" (
DATE text,
HEAT text,
TAP text,
FURN integer,
TIME text,
T_CHARGE integer,
L_PHOS_PIG integer,
FOUND_PIG integer,
D_RET integer,
G_RET integer,
P_CAST integer,
STEEL integer,
SIC integer,
C integer,
FESI_75 integer,
MN integer,
CU integer,
CR integer,
PHOS integer,
MO integer,
I_PYRITE integer,
POUR_BACK integer,
MACH_CHIPS integer,
NOTE,M
);

CREATE TABLE "Product" (
Customer text,
part_no text,
date text,
HEAT Integer, 
Made integer,
notes text);

CREATE TABLE "ContractReview" (
DATE TEXT,
CUSTOMER text,
PART_NUMBER text,
PO_NUMBER TEXT,
ACCEPTABLE TEXT,
REVIEW_BY TEXT,
NOTES text);

CREATE TABLE "Scrap" (
Date text,
PART_NO text,
AMOUNT NUMBER,
DEFECT NUMBER,
HEAT NUMBER,
TOTAL_AMOUNT NUMBER
);

CREATE TABLE returns (
    "DATE" TEXT,
    "PART_NO" TEXT,
    "AMOUNT" INTEGER,
    "DEFECT" INTEGER,
    "HEAT" INTEGER,
    "CUST_NCR" INTEGER
);

CREATE TABLE "Repair" (
DATE text,
PART_NO text,
HEAT integer,
QUANTITY integer,
REASON integer,
REPAIR text
);

CREATE TABLE "FOs" (
FO_NUMBER integer,
DUE_DATE text,
CUSTOMER text,
PART_NO text,
DESCRIPTIO text,
VISUAL text,
PATTERN_NO text,
ANUSE integer,
MATERIAL text,
DESCR_WORK text,
CUST_GEN_ text,
FO_DATE_ text,
DISPOSITIO text,
CHG_WHO text,
CHG_WHO_2 text,
WORK_DONE text,
FINISH_DAT text,
REASON text,
DISPOSITI0 text
);

CREATE TABLE "TBData" (
DATE text,
HEAT text,
TAP text,
TENSILE text,
YIELD text,
ELONG text,
AC_BHN integer,
AHT_BHN text
);

CREATE TABLE MicroData (
    "DATE" TEXT,
    "HEAT" INTEGER,
    "TAP" INTEGER,
    "DUCT" TEXT,
    "GRTYPE" TEXT,
    "C_SIZE" TEXT,
    "FERRITE" TEXT,
    "PEARLITE" TEXT,
    "CARBIDE" TEXT,
    "D_COUNT" INTEGER
);

CREATE TABLE FurnaceData (
    "DATE" TEXT,
    "HEAT" INTEGER,
    "TAP" INTEGER,
    "FURN" INTEGER,
    "TIME" TEXT,
    "C_E" INTEGER,
    "C" INTEGER,
    "SI" INTEGER,
    "TEMP" INTEGER
);
