Select
    C    Carbon
    , Si    Silicon
    , td.Cr    Chromium
    , td.Mn    Manganese
    , td.Cu    copper
    , cd.Al    aluminum
    , td.Phos    phosphorus
    , cd.Ni    nickel
    , cd.Mg    magnesium
    , cd.Si    sulfur
    , cd.Mo    moly
    , tb.Tensile
    , tb.ac_bhn ASBR
    , tb.elong
    , cstd.aht_bhn ahtbri
    , yield    
--    , Nodules    
    , "c_Size"
    , "d_Count"
    , Pearlite    
    , Carbide    
    , Ferrite    
    , ht_Method Heat

from
    ChemData cd
    Inner Join TBData tb on tb.Heat = cd.Heat and tb.Tap = cd.Tap
    Inner Join MicroData md on md.Heat = cd.Heat and md.Tap = cd.Tap
	Inner Join TapData td on td.Heat = cd.Heat and td.Tap = cd.Tap
    Left Join CastData cstd on cstd.heat = cd.heat and cstd.tap = cd.tap
Where
    cd.Heat = ''
    and cd.tap = ''
    
;
