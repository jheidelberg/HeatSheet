select 
    substr(fo_date,3,2) || rowid [FO_NUMBER]
    , rowid ROWID
    ,  FO_DATE
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
	FO_Date DESC, [fo_number] DESC
limit '@OFFSET', 200
-- Offset, # of results