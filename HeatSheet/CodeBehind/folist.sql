select 
    FO_Number
    , FO_Date
    , Part_No
    , Description
    , Customer
    , descr_work
    , case when finish_date is null or finish_date = '' then 'O' else 'C' end "Opened"
    , '' test
    , 'success' status
    , '' message
from fos
order by
	fo_number DESC
limit '@OFFSET', 100
-- Offset, # of results