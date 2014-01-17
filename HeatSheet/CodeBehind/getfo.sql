select 
    substr(fo_date,3,2) || rowid [FO_NUMBER]
    , rowid ROWID
    , due_date due_date
    , customer      customer
    , part_no       part_no
    , description   description
    , visual        visual
    , pattern_no    pattern_no
    , anuse         anuse
    , material      material
    , descr_work    descr_work
    , cust_gen      cust_gen
    , fo_date  fo_date
    , disposition   disposition
    , chg_who       chg_who
    , chg_who_2     chg_who_2
    , work_done     work_done
    , finish_date    finish_date
    , reason        reason
    , disposition2  disposition2
    , 'fos'         "table"
from fos
where rowid = '@fonumber'