select rowid, customer, part_no, "date", heat, made, notes
from product
where
    part_no like '@PART%'
    and heat like '@HEAT%'
    and customer like '@CUSTOMER%'
Order By
    RowID DESC
limit 0,100