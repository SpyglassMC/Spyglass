#> settings:common/get_difficulty_text.m
# @input args
#   Difficulty: int
# @within function
#   settings:send_setting_menu
#   settings:change_difficulty/on_change_difficulty.m
#   player_manager:notice_difficulty

$data modify storage settings: DifficultyText set from storage settings: TextRegistry.WithoutHoverEvent[$(Difficulty)]
