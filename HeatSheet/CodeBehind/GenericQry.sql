select rowid,*
from @TABLE
where
    @OPT1 like '@PAR1%' and
    @OPT2 like '@PAR2%' and
    @OPT3 like '@PAR3%'
order by rowid DESC
limit 0,100