#> mob_manager:init/multiplay_multiplier/angel
#
#
#
# @input score MobHealthMax
# @output score MobHealthMax
# @within function asset_manager:mob/summon/set_data

#> Val
# @private
    #declare score_holder $NearbyPlayerCount
    #declare score_holder $MultiplayMultiplierBase
    #declare score_holder $MultiplayMultiplier

# ベース倍率 0.10(e2)
    scoreboard players set $MultiplayMultiplierBase Temporary 10
# マルチ補正倍率 0.90(e2)
    scoreboard players set $MultiplayMultiplier Temporary 90
# マルチ補正倍率の計算 0.90(e2) * N(e0) + 0.10(e2)
    scoreboard players operation $MultiplayMultiplier Temporary *= $PlayerCount Global
    scoreboard players operation $MultiplayMultiplier Temporary += $MultiplayMultiplierBase Temporary
# 難易度倍率の計算 (0.65(e2) || 1.0(e2) || 1.50(e2) || 1.65(e2))
    execute if predicate api:global_vars/difficulty/1_normal if entity @s[tag=!Enemy.EndGameBoss] run scoreboard players operation $MultiplayMultiplier Temporary *= $65 Const
    execute if predicate api:global_vars/difficulty/1_normal if entity @s[tag= Enemy.EndGameBoss] run scoreboard players operation $MultiplayMultiplier Temporary *= $70 Const
    execute if predicate api:global_vars/difficulty/2_hard run scoreboard players operation $MultiplayMultiplier Temporary *= $100 Const
    execute if predicate api:global_vars/difficulty/min/3_blessless if entity @s[tag=!Enemy.EndGameBoss] run scoreboard players operation $MultiplayMultiplier Temporary *= $135 Const
    execute if predicate api:global_vars/difficulty/min/3_blessless if entity @s[tag= Enemy.EndGameBoss] run scoreboard players operation $MultiplayMultiplier Temporary *= $120 Const
    scoreboard players operation $MultiplayMultiplier Temporary /= $100 Const
# マルチ補正倍率の保存
    scoreboard players operation @s MobMaxHealthMultiplier = $MultiplayMultiplier Temporary
# マルチ補正の適用 MobHealthMax (e2) = MobHealthMax (e0) * $MultiplayMultiplier (e2)
    scoreboard players operation @s MobHealthMax *= $MultiplayMultiplier Temporary
# 整数値に補正
    scoreboard players operation @s MobHealthMax /= $100 Const
    scoreboard players operation @s MobHealthMax *= $100 Const
# リセット
    scoreboard players reset $NearbyPlayerCount Temporary
    scoreboard players reset $MultiplayMultiplier Temporary
    scoreboard players reset $MultiplayMultiplierBase Temporary
