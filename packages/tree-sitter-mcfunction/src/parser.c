#include "tree_sitter/parser.h"

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 19
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 18
#define ALIAS_COUNT 0
#define TOKEN_COUNT 12
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 1
#define MAX_ALIAS_SEQUENCE_LENGTH 4
#define PRODUCTION_ID_COUNT 2

enum ts_symbol_identifiers {
  sym__literal = 1,
  anon_sym_foo = 2,
  sym_comment = 3,
  anon_sym_DOLLAR = 4,
  anon_sym_DOLLAR_LPAREN = 5,
  anon_sym_RPAREN = 6,
  sym__space = 7,
  sym__eol = 8,
  sym__whitespace = 9,
  sym__line_continuation = 10,
  aux_sym__whatever_token1 = 11,
  sym_document = 12,
  sym_macro_line = 13,
  sym_macro_variable = 14,
  sym__whatever = 15,
  aux_sym_document_repeat1 = 16,
  aux_sym_macro_line_repeat1 = 17,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym__literal] = "_literal",
  [anon_sym_foo] = "foo_command",
  [sym_comment] = "comment",
  [anon_sym_DOLLAR] = "$",
  [anon_sym_DOLLAR_LPAREN] = "$(",
  [anon_sym_RPAREN] = ")",
  [sym__space] = "_space",
  [sym__eol] = "_eol",
  [sym__whitespace] = "_whitespace",
  [sym__line_continuation] = "_line_continuation",
  [aux_sym__whatever_token1] = "_whatever_token1",
  [sym_document] = "document",
  [sym_macro_line] = "macro_line",
  [sym_macro_variable] = "macro_variable",
  [sym__whatever] = "_whatever",
  [aux_sym_document_repeat1] = "document_repeat1",
  [aux_sym_macro_line_repeat1] = "macro_line_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym__literal] = sym__literal,
  [anon_sym_foo] = anon_sym_foo,
  [sym_comment] = sym_comment,
  [anon_sym_DOLLAR] = anon_sym_DOLLAR,
  [anon_sym_DOLLAR_LPAREN] = anon_sym_DOLLAR_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [sym__space] = sym__space,
  [sym__eol] = sym__eol,
  [sym__whitespace] = sym__whitespace,
  [sym__line_continuation] = sym__line_continuation,
  [aux_sym__whatever_token1] = aux_sym__whatever_token1,
  [sym_document] = sym_document,
  [sym_macro_line] = sym_macro_line,
  [sym_macro_variable] = sym_macro_variable,
  [sym__whatever] = sym__whatever,
  [aux_sym_document_repeat1] = aux_sym_document_repeat1,
  [aux_sym_macro_line_repeat1] = aux_sym_macro_line_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym__literal] = {
    .visible = false,
    .named = true,
  },
  [anon_sym_foo] = {
    .visible = true,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_DOLLAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLAR_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [sym__space] = {
    .visible = false,
    .named = true,
  },
  [sym__eol] = {
    .visible = false,
    .named = true,
  },
  [sym__whitespace] = {
    .visible = false,
    .named = true,
  },
  [sym__line_continuation] = {
    .visible = false,
    .named = true,
  },
  [aux_sym__whatever_token1] = {
    .visible = false,
    .named = false,
  },
  [sym_document] = {
    .visible = true,
    .named = true,
  },
  [sym_macro_line] = {
    .visible = true,
    .named = true,
  },
  [sym_macro_variable] = {
    .visible = true,
    .named = true,
  },
  [sym__whatever] = {
    .visible = false,
    .named = true,
  },
  [aux_sym_document_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_macro_line_repeat1] = {
    .visible = false,
    .named = false,
  },
};

enum ts_field_identifiers {
  field_name = 1,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_name] = "name",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_name, 1},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(6);
      if (!eof && (lookahead == 0 ||
          lookahead == '\n')) ADVANCE(13);
      if (lookahead == '\t') ADVANCE(15);
      if (lookahead == '\r') ADVANCE(2);
      if (lookahead == ' ') ADVANCE(12);
      if (lookahead == '#') ADVANCE(7);
      if (lookahead == '$') ADVANCE(8);
      if (lookahead == ')') ADVANCE(10);
      if (lookahead == '\\') ADVANCE(4);
      if (('0' <= lookahead && lookahead <= '9') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(11);
      END_STATE();
    case 1:
      if (!eof && (lookahead == 0)) ADVANCE(14);
      if (lookahead == '\n') ADVANCE(13);
      if (lookahead == '\r') ADVANCE(20);
      if (lookahead == '$') ADVANCE(22);
      if (lookahead == '\\') ADVANCE(19);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(16);
      if (lookahead != 0) ADVANCE(23);
      END_STATE();
    case 2:
      if (lookahead == '\n') ADVANCE(13);
      END_STATE();
    case 3:
      if (lookahead == '\n') ADVANCE(17);
      END_STATE();
    case 4:
      if (!eof && (lookahead == 0 ||
          lookahead == '\n')) ADVANCE(17);
      if (lookahead == '\r') ADVANCE(3);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(4);
      END_STATE();
    case 5:
      if (eof) ADVANCE(6);
      if (!eof && (lookahead == 0 ||
          lookahead == '\n')) ADVANCE(13);
      if (lookahead == '\r') ADVANCE(2);
      if (lookahead == '#') ADVANCE(7);
      if (lookahead == '$') ADVANCE(8);
      if (lookahead == '\\') ADVANCE(4);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(15);
      if (('0' <= lookahead && lookahead <= '9') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(11);
      END_STATE();
    case 6:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 7:
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(7);
      END_STATE();
    case 8:
      ACCEPT_TOKEN(anon_sym_DOLLAR);
      END_STATE();
    case 9:
      ACCEPT_TOKEN(anon_sym_DOLLAR_LPAREN);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    case 10:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 11:
      ACCEPT_TOKEN(sym__literal);
      if (('0' <= lookahead && lookahead <= '9') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(11);
      END_STATE();
    case 12:
      ACCEPT_TOKEN(sym__space);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(15);
      END_STATE();
    case 13:
      ACCEPT_TOKEN(sym__eol);
      END_STATE();
    case 14:
      ACCEPT_TOKEN(sym__eol);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    case 15:
      ACCEPT_TOKEN(sym__whitespace);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(15);
      END_STATE();
    case 16:
      ACCEPT_TOKEN(sym__whitespace);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(16);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    case 17:
      ACCEPT_TOKEN(sym__line_continuation);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(17);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(sym__line_continuation);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(18);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(aux_sym__whatever_token1);
      if (!eof && (lookahead == 0)) ADVANCE(18);
      if (lookahead == '\n') ADVANCE(17);
      if (lookahead == '\r') ADVANCE(21);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(19);
      if (lookahead != 0) ADVANCE(23);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(aux_sym__whatever_token1);
      if (lookahead == '\n') ADVANCE(13);
      if (lookahead != 0) ADVANCE(23);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(aux_sym__whatever_token1);
      if (lookahead == '\n') ADVANCE(17);
      if (lookahead != 0) ADVANCE(23);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(aux_sym__whatever_token1);
      if (lookahead == '(') ADVANCE(9);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(aux_sym__whatever_token1);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(23);
      END_STATE();
    default:
      return false;
  }
}

static bool ts_lex_keywords(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (lookahead == 'f') ADVANCE(1);
      END_STATE();
    case 1:
      if (lookahead == 'o') ADVANCE(2);
      END_STATE();
    case 2:
      if (lookahead == 'o') ADVANCE(3);
      END_STATE();
    case 3:
      ACCEPT_TOKEN(anon_sym_foo);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 5},
  [2] = {.lex_state = 5},
  [3] = {.lex_state = 5},
  [4] = {.lex_state = 1},
  [5] = {.lex_state = 1},
  [6] = {.lex_state = 1},
  [7] = {.lex_state = 5},
  [8] = {.lex_state = 5},
  [9] = {.lex_state = 5},
  [10] = {.lex_state = 5},
  [11] = {.lex_state = 1},
  [12] = {.lex_state = 5},
  [13] = {.lex_state = 5},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 0},
  [16] = {.lex_state = 0},
  [17] = {.lex_state = 0},
  [18] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym__literal] = ACTIONS(1),
    [anon_sym_foo] = ACTIONS(1),
    [sym_comment] = ACTIONS(1),
    [anon_sym_DOLLAR] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [sym__space] = ACTIONS(1),
    [sym__eol] = ACTIONS(1),
    [sym__whitespace] = ACTIONS(1),
    [sym__line_continuation] = ACTIONS(3),
  },
  [1] = {
    [sym_document] = STATE(14),
    [sym_macro_line] = STATE(12),
    [aux_sym_document_repeat1] = STATE(2),
    [ts_builtin_sym_end] = ACTIONS(5),
    [anon_sym_foo] = ACTIONS(7),
    [sym_comment] = ACTIONS(7),
    [anon_sym_DOLLAR] = ACTIONS(9),
    [sym__eol] = ACTIONS(11),
    [sym__whitespace] = ACTIONS(13),
    [sym__line_continuation] = ACTIONS(3),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 8,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(9), 1,
      anon_sym_DOLLAR,
    ACTIONS(13), 1,
      sym__whitespace,
    ACTIONS(15), 1,
      ts_builtin_sym_end,
    ACTIONS(17), 1,
      sym__eol,
    STATE(3), 1,
      aux_sym_document_repeat1,
    STATE(12), 1,
      sym_macro_line,
    ACTIONS(7), 2,
      anon_sym_foo,
      sym_comment,
  [26] = 8,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(19), 1,
      ts_builtin_sym_end,
    ACTIONS(24), 1,
      anon_sym_DOLLAR,
    ACTIONS(27), 1,
      sym__eol,
    ACTIONS(30), 1,
      sym__whitespace,
    STATE(3), 1,
      aux_sym_document_repeat1,
    STATE(12), 1,
      sym_macro_line,
    ACTIONS(21), 2,
      anon_sym_foo,
      sym_comment,
  [52] = 5,
    ACTIONS(33), 1,
      anon_sym_DOLLAR_LPAREN,
    ACTIONS(37), 1,
      sym__line_continuation,
    ACTIONS(39), 1,
      aux_sym__whatever_token1,
    ACTIONS(35), 2,
      sym__eol,
      sym__whitespace,
    STATE(5), 3,
      sym_macro_variable,
      sym__whatever,
      aux_sym_macro_line_repeat1,
  [71] = 5,
    ACTIONS(33), 1,
      anon_sym_DOLLAR_LPAREN,
    ACTIONS(37), 1,
      sym__line_continuation,
    ACTIONS(43), 1,
      aux_sym__whatever_token1,
    ACTIONS(41), 2,
      sym__eol,
      sym__whitespace,
    STATE(6), 3,
      sym_macro_variable,
      sym__whatever,
      aux_sym_macro_line_repeat1,
  [90] = 5,
    ACTIONS(37), 1,
      sym__line_continuation,
    ACTIONS(45), 1,
      anon_sym_DOLLAR_LPAREN,
    ACTIONS(48), 1,
      sym__eol,
    ACTIONS(50), 2,
      sym__whitespace,
      aux_sym__whatever_token1,
    STATE(6), 3,
      sym_macro_variable,
      sym__whatever,
      aux_sym_macro_line_repeat1,
  [109] = 6,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(9), 1,
      anon_sym_DOLLAR,
    ACTIONS(55), 1,
      sym__eol,
    ACTIONS(57), 1,
      sym__whitespace,
    STATE(13), 1,
      sym_macro_line,
    ACTIONS(53), 2,
      anon_sym_foo,
      sym_comment,
  [129] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(19), 6,
      ts_builtin_sym_end,
      anon_sym_foo,
      sym_comment,
      anon_sym_DOLLAR,
      sym__eol,
      sym__whitespace,
  [141] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(59), 6,
      ts_builtin_sym_end,
      anon_sym_foo,
      sym_comment,
      anon_sym_DOLLAR,
      sym__eol,
      sym__whitespace,
  [153] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(61), 6,
      ts_builtin_sym_end,
      anon_sym_foo,
      sym_comment,
      anon_sym_DOLLAR,
      sym__eol,
      sym__whitespace,
  [165] = 2,
    ACTIONS(37), 1,
      sym__line_continuation,
    ACTIONS(63), 4,
      anon_sym_DOLLAR_LPAREN,
      sym__eol,
      sym__whitespace,
      aux_sym__whatever_token1,
  [175] = 3,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(55), 1,
      sym__eol,
    ACTIONS(57), 1,
      sym__whitespace,
  [185] = 3,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(65), 1,
      sym__eol,
    ACTIONS(67), 1,
      sym__whitespace,
  [195] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(69), 1,
      ts_builtin_sym_end,
  [202] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(65), 1,
      sym__eol,
  [209] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(71), 1,
      sym__literal,
  [216] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(73), 1,
      anon_sym_RPAREN,
  [223] = 2,
    ACTIONS(3), 1,
      sym__line_continuation,
    ACTIONS(75), 1,
      sym__eol,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 26,
  [SMALL_STATE(4)] = 52,
  [SMALL_STATE(5)] = 71,
  [SMALL_STATE(6)] = 90,
  [SMALL_STATE(7)] = 109,
  [SMALL_STATE(8)] = 129,
  [SMALL_STATE(9)] = 141,
  [SMALL_STATE(10)] = 153,
  [SMALL_STATE(11)] = 165,
  [SMALL_STATE(12)] = 175,
  [SMALL_STATE(13)] = 185,
  [SMALL_STATE(14)] = 195,
  [SMALL_STATE(15)] = 202,
  [SMALL_STATE(16)] = 209,
  [SMALL_STATE(17)] = 216,
  [SMALL_STATE(18)] = 223,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, SHIFT_EXTRA(),
  [5] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document, 0),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [11] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [15] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document, 1),
  [17] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [19] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 2),
  [21] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 2), SHIFT_REPEAT(12),
  [24] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 2), SHIFT_REPEAT(4),
  [27] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 2), SHIFT_REPEAT(3),
  [30] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 2), SHIFT_REPEAT(7),
  [33] = {.entry = {.count = 1, .reusable = false}}, SHIFT(16),
  [35] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_macro_line, 1),
  [37] = {.entry = {.count = 1, .reusable = false}}, SHIFT_EXTRA(),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(5),
  [41] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_macro_line, 2),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(6),
  [45] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_macro_line_repeat1, 2), SHIFT_REPEAT(16),
  [48] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_macro_line_repeat1, 2),
  [50] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_macro_line_repeat1, 2), SHIFT_REPEAT(6),
  [53] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [55] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [57] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [59] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 3),
  [61] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_document_repeat1, 4),
  [63] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_macro_variable, 3, .production_id = 1),
  [65] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [67] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [69] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [71] = {.entry = {.count = 1, .reusable = true}}, SHIFT(17),
  [73] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [75] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef TREE_SITTER_HIDE_SYMBOLS
#define TS_PUBLIC
#elif defined(_WIN32)
#define TS_PUBLIC __declspec(dllexport)
#else
#define TS_PUBLIC __attribute__((visibility("default")))
#endif

TS_PUBLIC const TSLanguage *tree_sitter_mcfunction() {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .keyword_lex_fn = ts_lex_keywords,
    .keyword_capture_token = sym__literal,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
