import { ImportBuiltinFunctionsDeclarationBuilder } from '../builders';

export default {
  enter (path, state) {
    ImportBuiltinFunctionsDeclarationBuilder.initialize();
  },

  exit (path) {
    path.unshiftContainer('body', ImportBuiltinFunctionsDeclarationBuilder.build());
  },
};
