#> mob_manager:entity_finder/entity_hurt_player/fetch_entity
#
# 多分このfunctionの実行者は攻撃してきたEntityであるはず
#
# @within function mob_manager:entity_finder/entity_hurt_player/filters/0

#> Private
# @private
#declare score_holder $Damage

# ダメージ種別取得
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={type-melee=true}}] run data modify storage mob_manager:entity_finder DamageType set value "vanilla_melee"
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={type-projectile=true}}] run data modify storage mob_manager:entity_finder DamageType set value "vanilla_projectile"
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={type-explosion=true}}] run data modify storage mob_manager:entity_finder DamageType set value "vanilla_explosion"
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={type-other=true}}] run data modify storage mob_manager:entity_finder DamageType set value "vanilla_other"
# 防御されたかの取得
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={blocked=true}}] run data modify storage mob_manager:entity_finder Blocked set value true
    execute if entity @p[tag=DamagedPlayer,advancements={mob_manager:entity_finder/check_entity_hurt_player={blocked=false}}] run data modify storage mob_manager:entity_finder Blocked set value false
# ダメージ取得
    scoreboard players set $Damage Temporary 0
    scoreboard players operation $Damage Temporary += @p[tag=DamagedPlayer] TakenDamage
    scoreboard players operation $Damage Temporary += @p[tag=DamagedPlayer] AbsorbedDamage
    scoreboard players operation $Damage Temporary *= $10 Const
# ScoreToHPFlucに衝撃吸収分だけ加算する
    execute store result storage api: Argument.Fluctuation double -0.1 run scoreboard players get @p[tag=DamagedPlayer] AbsorbedDamage
    execute store result storage api: Argument.Attacker int 1 run scoreboard players get @s MobUUID
    data modify storage api: Argument.DeathMessage set value ['{"translate":"%1$sは%2$sに倒された","with":[{"selector":"@s"},{"nbt":"Return.AttackerName","storage":"lib:","interpret":true}]}']
    data modify storage api: Argument.DisableLog set value true
    execute as @p[tag=DamagedPlayer] at @s run function lib:score_to_health_wrapper/fluctuation
    data remove storage api: Argument.DeathMessage

# ArtifactEvents にデータ追加
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].ArtifactEvents.Damage append value {IsVanilla:true}
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].ArtifactEvents.Damage[-1].Type set from storage mob_manager:entity_finder DamageType
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].ArtifactEvents.Damage[-1].Blocked set from storage mob_manager:entity_finder Blocked
    execute store result storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].ArtifactEvents.Damage[-1].From int 1 run scoreboard players get @s MobUUID
    execute store result storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].ArtifactEvents.Damage[-1].Amount double 0.01 run scoreboard players get $Damage Temporary

# 攻撃された Entity の EntityStorage 取得
    function oh_my_dat:please
# こっちにもイベントデータ追加
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack append value {IsVanilla:true}
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].Type set from storage mob_manager:entity_finder DamageType
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].Blocked set from storage mob_manager:entity_finder Blocked
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].To append value -1
    execute store result storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].To[-1] int 1 run scoreboard players get @p[tag=DamagedPlayer] UserID
    data modify storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].Amounts append value -1d
    execute store result storage oh_my_dat: _[-4][-4][-4][-4][-4][-4][-4][-4].MobEvents.Attack[-1].Amounts[-1] double 0.01 run scoreboard players get $Damage Temporary

# リセット
    data remove storage mob_manager:entity_finder Blocked
    data remove storage mob_manager:entity_finder DamageType
    scoreboard players reset @p[tag=DamagedPlayer] TakenDamage
    scoreboard players reset @p[tag=DamagedPlayer] AbsorbedDamage
    scoreboard players reset $Damage Temporary
