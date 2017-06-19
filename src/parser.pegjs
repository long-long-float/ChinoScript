{
  const AST = require('./ast.js')
  const Types = require('./types.js')

  const RESERVED_WORDS = ["return", "int", "string", "char", "void", "for", "while", "if"];

  function binary_op(left, rest) {
    left = flatten([left]);
    rest = filter(flatten(rest), [" "]);

    const binary_op_intr = function(nodes) {
      const right = nodes.pop();
      const op    = nodes.pop();
      let left;
      if (nodes.length == 1) {
        left = nodes[0];
      }
      else {
        left = binary_op_intr(nodes);
      }
      if (op === '=') {
        return new AST.Assign(left, right, location());
      } else {
        return new AST.BinaryOp(left, op, right, location());
      }
    }
    return binary_op_intr(left.concat(rest));
  }

  function unary_op_f(op, right) {
    return new AST.UnaryOpFront(op, right, location());
  }

  function args(fst_arg, rest_args) {
    if(fst_arg === null) return [];
    else { return filter(flatten([fst_arg].concat(rest_args))); }
  }

  function type(id, ary) {
    // FIXME: どうにかしたい
    const typeTable = {
      'int': 'Integer', 'bool': 'Boolean', 'char': 'Char'
    };

    const typeName = typeTable.hasOwnProperty(id.value) ?
      typeTable[id.value] : id.value;

    if (ary.length > 0) {
      return new Types.Type('Array', [new Types.Type(typeName)]);
    } else if (id.value === 'void') {
      return new Types.Type('Tuple', []);
    } else if (id.value === 'string') {
      return new Types.Type('Array', [new Types.Type('Char')]);
    } else {
      return new Types.Type(typeName);
    }
  }

  // utility functions

  function is_array(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }

  function flatten(ary) {
    if(!is_array(ary)) {
      return ary;
    }
    else {
      return Array.prototype.concat.apply([], ary.map(flatten));
    }
  }

  function filter(ary) {
    const pattern = [' ', ',', "\n", null]
    return ary.filter(function(e) {
      if(is_array(e) && e.length == 0) return false;
      if(pattern.indexOf(e) !== -1) return false;
      return true;
    });
  }
}

program
  = program:(top_statement _)*
    { return filter(flatten(program)); }

top_statement
  = statement _ comment?
  / comment

statement
  = expr:expression _ ";" { return expr }
  / def_var

def_var
  = eternal:"eternal"? _ type:type _ name:identifier _ length:("[" integer "]")? _ init_value:("=" _  expression) _ ";"
    { return new AST.DefineVariable(eternal !== null, type, name, length !== null ? length[1] : null, init_value[2]); }

expression
  = left:lh_expression rest:(_ "=" _ term0)+
    { return binary_op(left, rest); }
  / term:term0

lh_expression
  = id:identifier index:(_ "[" _ expression _ "]" _)?
    { return new AST.LHExpression(id, index, location()); }

term0
  = left:term1 rest:(_ "||" _ term1)+
    { return binary_op(left, rest); }
  / term1

term1
  = left:term2 rest:(_ "&&" _ term2)+
    { return binary_op(left, rest); }
  / term2

term2
  = left:term3 rest:(_ ("<=" / ">=" / "<" / ">" / "==" / "!=") _ term3)+
    { return binary_op(left, rest); }
  / term3

term3
  = left:term4 rest:(_ ("+" / "-") _ term4)+
    { return binary_op(left, rest); }
  / term4

term4
  = left:unary rest:(_ ("*" / "/" / "%") _ unary)+
    { return binary_op(left, rest); }
  / unary

unary
  = op:("-" / "+") _ val:factor { return unary_op_f(op, val); }
  / factor

factor
  = "(" _ expr:expression _ ")" { return expr; }
  / name:identifier _ "(" _ fst_arg:expression? rest_args:(_ "," _ expression)* _ ")"
    { return new AST.CallFunction(name, args(fst_arg, rest_args)); }
  / integer
  /*/ string
  / char
  / boolean */
  / id:identifier index:(_ "[" _ expression _ "]" _)?
    { return new AST.ReferenceVariable(id, index !== null ? index[3] : null); }
  /// array

integer
  // TODO: 負数に対応
  = [0-9]+
    { return new AST.IntegerLiteral(parseInt(text(), 10), location()); }

comment
  // TODO: 複数行コメントに対応
  = "//" [^\n\r]* _ { return null; }

type
  = id:type_identifier ary:(_ "[" "]")*
    & { return ["return"].indexOf(id.value) === -1; }
    { return type(id, ary); }

identifier
  = content:([a-zA-Z_][a-zA-Z_0-9]*)
    & { return RESERVED_WORDS.indexOf(text()) === -1; }
    { return new AST.Identifier(text(), location()); }

type_identifier
  = content:([a-zA-Z_][a-zA-Z_0-9]*)
    & { return ["return"].indexOf(text()) === -1; }
    { return new AST.Identifier(text(), location()); }

nl
  = ("\r" / "\r\n" / "\n") { return null; }

_ "whitespace"
  = [ \t\n\r]*