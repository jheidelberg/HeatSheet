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
order by
	fo_number DESC
limit '@OFFSET', 100
-- Offset, # of results