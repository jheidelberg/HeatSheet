select 
    FO_Number
    , FO_Date
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
    @OpenOnly
order by
	fo_number DESC
limit '@OFFSET', 200
-- Offset, # of results