#> world_manager:nexus_loader/_index.d
# @private

#> Storage
# @within function
#   world_manager:nexus_loader/**
#   api:nexus_loader/*
#declare storage world_manager:nexus_loader

#> Private
# @within function world_manager:nexus_loader/**
#declare score_holder $Temp

#> Private
# @within function
#   world_manager:nexus_loader/load/
#   world_manager:nexus_loader/load/**check
#   world_manager:nexus_loader/load/outliers/check
    #declare score_holder $PlayerX
    #declare score_holder $PlayerY
    #declare score_holder $PlayerZ

#> Private
# @within function
#   world_manager:nexus_loader/load/
#   world_manager:nexus_loader/shrink.m
    #declare score_holder $Min
    #declare score_holder $Max
