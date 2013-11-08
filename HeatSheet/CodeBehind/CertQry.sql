Select
    cd.HEAT
    , C    carbon
    , Si    silicon
    , td.Cr    chromium
    , td.Mn    manganese
    , td.Cu    copper
    , cd.Al    aluminum
    , td.Phos    phosphorus
    , cd.Ni    nickel
    , cd.Mg    magnesium
    , cd.Si    sulfur
    , cd.Mo    moly
    , tb.Tensile tensile
    , tb.ac_bhn asbr
    , tb.elong elong
    , cstd.aht_bhn ahtbri
    , yield    yield
/*    , Nodules    */
    , "c_Size" c_size
    , "d_Count" d_count
    , Pearlite pearlite
    , Carbide carbide
    , Ferrite ferrite
    , ht_Method htmethod

from
    ChemData cd
    left Join TBData tb on tb.Heat = cd.Heat and tb.Tap = cd.Tap
    left Join MicroData md on md.Heat = cd.Heat and md.Tap = cd.Tap
	left Join TapData td on td.Heat = cd.Heat and td.Tap = cd.Tap
    Left Join CastData cstd on cstd.heat = cd.heat and cstd.tap = cd.tap
Where
    cd.Heat = '%HEAT%'
    and cd.tap = '%TAP%'
    
;
