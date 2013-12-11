select 
    FO_Number
    , FO_Date
    , Part_No
    , Description
    , Customer
    , '' test
    , 'success' status
    , '' message
from fos
where
    Customer like '@CUSTOMER%'
    and part_no like '@PART%'
    and pattern_no like '@PATTERN%'
order by
	fo_number DESC
limit '@OFFSET', 100
-- Offset, # of results