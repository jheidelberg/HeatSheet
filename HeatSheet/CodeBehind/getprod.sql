select rowid, date, heat, customer, part_no, made, notes
from product
where
    rowid = '@ROWID'