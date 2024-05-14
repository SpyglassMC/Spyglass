package tree_sitter_mcfunction_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-mcfunction"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mcfunction.Language())
	if language == nil {
		t.Errorf("Error loading Mcfunction grammar")
	}
}
