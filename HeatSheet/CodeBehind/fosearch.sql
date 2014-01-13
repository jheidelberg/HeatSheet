select 
    FO_Number
    , FO_DATE
    , Part_No
    , Description
    , Customer
    , Reason
    , case when finish_date is null or finish_date = '' then 'O' else 'C' end "Opened"
    , '' test
    , 'success' status
    , '' message
from fos
where
    Customer like '@CUSTOMER%'
    and part_no like '@PART%'
    and pattern_no like '@PATTERN%'
    and @OpenOnly
order by
	FO_DATE DESC , fo_number DESC
limit '@OFFSET', 1000
-- Offset, # of results