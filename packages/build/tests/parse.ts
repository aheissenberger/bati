import { suite } from "uvu";
import * as assert from "uvu/assert";
import { ast, transformAst } from "../src/parse";
import { assertEquivalentAst } from "../src/testUtils";

function testAst(code: string, meta: VikeMeta) {
  const tree = ast(expected(code));

  return transformAst(tree, meta);
}

function expected(code: string) {
  return `const a: number = 1;
${code}
const b = 2;`;
}

const Suite = suite("transformAst");

Suite("===:react", () => {
  const tree = testAst(
    `if (import.meta.VIKE_FRAMEWORK === "react") {
    content = { ...content, jsx: "react" };
  }`,
    {
      VIKE_FRAMEWORK: "react",
    }
  );

  assertEquivalentAst(
    tree,
    ast(expected(`content = { ...content, jsx: "react" };`))
  );
});

Suite("===:solid", () => {
  const tree = testAst(
    `if (import.meta.VIKE_FRAMEWORK === "react") {
    content = { ...content, jsx: "react" };
  }`,
    {
      VIKE_FRAMEWORK: "solid",
    }
  );

  assertEquivalentAst(tree, ast(expected(``)));
});

Suite("includes:react", () => {
  const tree = testAst(
    `if (["react"].includes(import.meta.VIKE_FRAMEWORK!)) {
    content = { ...content, jsx: "react" };
  }`,
    {
      VIKE_FRAMEWORK: "react",
    }
  );

  assertEquivalentAst(
    tree,
    ast(
      expected(`
      content = {
        ...content,
        jsx: "react"
      };
    `)
    )
  );
});

Suite("includes:solid", () => {
  const tree = testAst(
    `if (["react"].includes(import.meta.VIKE_FRAMEWORK!)) {
    content = { ...content, jsx: "react" };
  }`,
    {
      VIKE_FRAMEWORK: "solid",
    }
  );

  assertEquivalentAst(tree, ast(expected(``)));
});

Suite("if-elseif-else:react", () => {
  const tree = testAst(
    `if (import.meta.VIKE_FRAMEWORK === "react") {
      content = { ...content, jsx: "react" };
    } else if (import.meta.VIKE_FRAMEWORK === "solid") {
      content = { ...content, jsx: "preserve", jsxImportSource: "solid-js" };
    } else {
      console.log('NOTHING TO DO');
    }`,
    {
      VIKE_FRAMEWORK: "react",
    }
  );

  assertEquivalentAst(
    tree,
    ast(expected(`content = { ...content, jsx: "react" };`))
  );
});

Suite("if-elseif-else:solid", () => {
  const tree = testAst(
    `if (import.meta.VIKE_FRAMEWORK === "react") {
      content = { ...content, jsx: "react" };
    } else if (import.meta.VIKE_FRAMEWORK === "solid") {
      content = { ...content, jsx: "preserve", jsxImportSource: "solid-js" };
    } else {
      console.log('NOTHING TO DO');
    }`,
    {
      VIKE_FRAMEWORK: "solid",
    }
  );

  assertEquivalentAst(
    tree,
    ast(
      expected(
        `content = { ...content, jsx: "preserve", jsxImportSource: "solid-js" };`
      )
    )
  );
});

Suite("if-elseif-else:other", () => {
  const tree = testAst(
    `if (import.meta.VIKE_FRAMEWORK === "react") {
      content = { ...content, jsx: "react" };
    } else if (import.meta.VIKE_FRAMEWORK === "solid") {
      content = { ...content, jsx: "preserve", jsxImportSource: "solid-js" };
    } else {
      console.log('NOTHING TO DO');
    }`,
    {
      VIKE_FRAMEWORK: "vue",
    }
  );

  assertEquivalentAst(tree, ast(expected(`console.log('NOTHING TO DO');`)));
});

Suite("external variable", () => {
  assert.throws(
    () =>
      testAst(
        `if (import.meta.VIKE_FRAMEWORK === someVar) {
    content = { ...content, jsx: "react" };
  }`,
        {
          VIKE_FRAMEWORK: "react",
        }
      ),
    (err: unknown) => err instanceof ReferenceError
  );
});

Suite("ternary:react", () => {
  const tree = testAst(
    `import.meta.VIKE_FRAMEWORK === "react"
    ? 1
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? 2
    : null`,
    {
      VIKE_FRAMEWORK: "react",
    }
  );

  assertEquivalentAst(tree, ast(expected(`1`)));
});

Suite("ternary:solid", () => {
  const tree = testAst(
    `import.meta.VIKE_FRAMEWORK === "react"
    ? 1
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? 2
    : null`,
    {
      VIKE_FRAMEWORK: "solid",
    }
  );

  assertEquivalentAst(tree, ast(expected(`2`)));
});

Suite("ternary:other", () => {
  const tree = testAst(
    `import.meta.VIKE_FRAMEWORK === "react"
    ? 1
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? 2
    : null`,
    {
      VIKE_FRAMEWORK: "vue",
    }
  );

  assertEquivalentAst(tree, ast(expected(`null`)));
});

Suite("import cleanup:react", () => {
  const tree = transformAst(
    ast(
      `import react from 'react';
    import { solid } from 'solid';
    
    const framework = import.meta.VIKE_FRAMEWORK === "react"
    ? react()
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? solid()
    : null;
    `
    ),
    {
      VIKE_FRAMEWORK: "react",
    }
  );

  assertEquivalentAst(
    tree,
    ast(
      `import react from 'react';
    const framework = react();`
    )
  );
});

Suite("import cleanup:solid", () => {
  const tree = transformAst(
    ast(
      `import react from 'react';
    import { solid } from 'solid';
    
    const framework = import.meta.VIKE_FRAMEWORK === "react"
    ? react()
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? solid()
    : null;
    `
    ),
    {
      VIKE_FRAMEWORK: "solid",
    }
  );

  assertEquivalentAst(
    tree,
    ast(
      `import { solid } from 'solid';
    const framework = solid();`
    )
  );
});

Suite("import cleanup:other", () => {
  const tree = transformAst(
    ast(
      `import react from 'react';
    import { solid } from 'solid';
    
    const framework = import.meta.VIKE_FRAMEWORK === "react"
    ? react()
    : import.meta.VIKE_FRAMEWORK === "solid"
    ? solid()
    : null;
    `
    ),
    {
      VIKE_FRAMEWORK: "vue",
    }
  );

  assertEquivalentAst(tree, ast(`const framework = null;`));
});

Suite("remove VIKE_REMOVE", () => {
  const tree = transformAst(ast(`const a = [import.meta.VIKE_REMOVE, 'a']`), {
    VIKE_FRAMEWORK: "vue",
  });

  assertEquivalentAst(tree, ast(`const a = ['a']`));
});

Suite.run();
