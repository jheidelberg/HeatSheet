Select
    cd.HEAT
    , C    Carbon
    , Si    Silicon
    , cd.Cr    Chromium
    , cd.Mn    Manganese
    , cd.Cu    Copper
    , cd.Al    Aluminum
/*    , td.Phos    Phosphorus*/
    , cd.ph    Phosphorus
    , cd.Ni    Nickel
    , cd.Mg    Magnesium
/*    , cd.Si    Sulfur*/
    , cd.S    Sulfur
    , cd.Mo    Moly
    , tb.Tensile Tensile
    , cstd.ac_bhn AsBr
    , tb.elong Elongation
    , cstd.aht_bhn AHTBri
    , yield    Yield
    , Duct Nodules    
    , "c_Size" cSize
    , "d_Count" dCount
    , Pearlite Pearlite
    , Carbide Carbide
    , Ferrite Ferrite
    , ht_Method HeatTreat
    , p.made parts
    , '' spec
    , p.customer customer
    , material class
    , '' test
    , 'success' status
    , '' message
    , date() [date]
    , cd.tap tap
    , p.part_no part
from
    ChemData cd
    left Join TBData tb on tb.Heat = cd.Heat and tb.Tap = cd.Tap
    left Join MicroData md on md.Heat = cd.Heat and md.Tap = cd.Tap
	left Join TapData td on td.Heat = cd.Heat and td.Tap = cd.Tap
    Left Join CastData cstd on cstd.heat = cd.heat and cstd.tap = cd.tap
    Left Join Product p on p.part_no = cstd.Part_no and p.heat=cd.heat
Where
    cd.HEAT = '@HEAT' and cstd.Part_No like '@PART'
Order By
   cd.tap
