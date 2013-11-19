Select
    cd.HEAT
    , C    Carbon
    , Si    Silicon
    , cd.Cr    Chromium
    , cd.Mn    Manganese
    , cd.Cu    Copper
    , cd.Al    Aluminum
    , td.Phos    Phosphorus
    , cd.Ni    Nickel
    , cd.Mg    Magnesium
    , cd.Si    Sulfur
    , cd.Mo    Moly
    , tb.Tensile Tensile
    , tb.ac_bhn AsBr
    , tb.elong Elongation
    , cstd.aht_bhn AHTBri
    , yield    Yield
/*    , Nodules    */
    , "c_Size" cSize
    , "d_Count" dCount
    , Pearlite Pearlite
    , Carbide Carbide
    , Ferrite Ferrite
    , ht_Method HeatTreat

from
    ChemData cd
    left Join TBData tb on tb.Heat = cd.Heat and tb.Tap = cd.Tap
    left Join MicroData md on md.Heat = cd.Heat and md.Tap = cd.Tap
	left Join TapData td on td.Heat = cd.Heat and td.Tap = cd.Tap
    Left Join CastData cstd on cstd.heat = cd.heat and cstd.tap = cd.tap
Where
    cstd.Part_No like '@PART' and cd.HEAT = '@HEAT'