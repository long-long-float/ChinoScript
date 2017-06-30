{
  const AST = require('./ast.js')
  const Types = require('./type.js')

  const RESERVED_WORDS = ["return", "int", "string", "char", "void", "for", "while", "if", "let"];

  function binary_op(left, rest, type) {
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

  function combined_binary_op(left, rest) {
    const op = rest[1].charAt(0);
    const rightRef = new AST.ReferenceVariable(left.name, left.index);
    const right = new AST.BinaryOp(rightRef, op, rest[3], location());

    return new AST.Assign(left, right, location());
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
      'int': 'Integer', 'bool': 'Boolean', 'char': 'Char', 'string': 'String'
    };

    const typeName = typeTable.hasOwnProperty(id.value) ?
      typeTable[id.value] : id.value;

    if (ary.length > 0) {
      return new Types.Type('Array', [new Types.Type(typeName, [])]);
    } else if (id.value === 'void') {
      return new Types.Type('Tuple', []);
    } else if (id.value === 'string') {
      return new Types.Type('Array', [new Types.Type('Char', [])]);
    } else {
      return new Types.Type(typeName, []);
    }
  }

  function string(value) {
    return new AST.ArrayLiteral(new Types.Type('Array', [new Types.Type('Char', [])]), value.map(function(ch) {
      return new AST.CharLiteral(ch, location());
    }), location())
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
  / def_fun
  / comment

def_fun
  = type:type _ name:identifier _ generic_types:( "<" identifier _ :("," _ identifier _)* ">" )? _
    "(" _  fst_arg:def_arg? rest_args:(_ "," _ def_arg)* _ ")" _ block:block
    {
      const gt = filter(flatten(generic_types || []))
      gt.shift()
      gt.pop()
      return new AST.FunctionDefinition(type, name, gt, args(fst_arg, rest_args), block, location());
    }

def_arg
  = type:type _ name:identifier
    { return new AST.ArgumentDefinition(type, name, location()); }

statement
  = def_var
  / return_stmt
  / break_stmt
  / for_stmt
  / while_stmt
  / expr:expression _ ";" { return expr }

def_var
  = eternal:"eternal"? _ type:type _ name:identifier _ length:("[" integer "]")? _ init_value:("=" _  expression) _ ";"
    { return new AST.DefineVariable(eternal !== null, type, name, length !== null ? length[1] : null, init_value[2], location()); }

return_stmt
  = "return" _ value:expression? _ ";"
    { return new AST.ReturnStatement(value); }

break_stmt
  = "break" _ ";"
    { return new AST.BreakStatement(location()); }

for_stmt
  = "for" _ "(" _ init:(def_var / expression _ ";")  _ cond:expression _ ";" _ update:expression _ ")" _ block:block
    { return new AST.ForStatement(init, cond, update, block, location()); }

while_stmt
  = "while" _ "(" _ cond:expression _ ")" _ block:block
    { return new AST.WhileStatement(cond, block, location()); }

expression
  = left:lh_expression rest:(_ "=" _ term0)+
    { return binary_op(left, rest); }
  / left:lh_expression rest:(_ ("+=" / "-=" / "*=" / "/=" / "%=") _ term0)
    { return combined_binary_op(left, rest); }
  / term:term0

lh_expression
  = id:identifier index:(_ "[" _ expression _ "]" _)?
    { return new AST.LHExpression(id, index ? index[3] : null, location()); }

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
  / if_expr
  / name:identifier _ "(" _ fst_arg:expression? rest_args:(_ "," _ expression)* _ ")"
    { return new AST.CallFunction(name, args(fst_arg, rest_args)); }
  / integer
  / string
  / char
  / boolean
  / id:identifier index:(_ "[" _ expression _ "]" _)?
    { return new AST.ReferenceVariable(id, index !== null ? index[3] : null); }
  / array

string
  // TODO: エスケープ周りを修正
  = "\"" value:([^"]*) "\""
    { return string(value); }

char
  = "'" value:. "'"
    { return new AST.CharLiteral(value, location()); }

boolean
  = value:("true" / "false")
    { return new AST.BooleanLiteral(value === 'true', location()); }

integer
  // TODO: 負数に対応
  = [0-9]+
    { return new AST.IntegerLiteral(parseInt(text(), 10), location()); }

if_expr
  = "if" _ "(" _ cond:expression _ ")" _ iftrue:block iffalse:(_ "else" _ block)?
    { return new AST.IfExpression(cond, iftrue, iffalse !== null ? iffalse[3] : null); }

array
  = type:array_type _ "{" _ fst_value:expression? values:(_ "," _ expression)* _ "}"
    {
      return new AST.ArrayLiteral(type,
        fst_value ?
          [fst_value].concat(values.map(function(value) { return value[3]; })) :
          []);
    }

block
  = "{" _ comment? _ stmts:(statement _ comment? / comment) * _ "}"
    { return new AST.Block(filter(flatten(stmts)), location()); }
  / stmt:statement
    { return new AST.Block([stmt], location()); }

comment
  // TODO: 複数行コメントに対応
  = "//" [^\n\r]* _ { return null; }

type
  = id:type_identifier ary:(_ "[" "]")*
    & { return ["return"].indexOf(id.value) === -1; }
    { return type(id, ary); }

array_type
  = id:type_identifier ary:(_ "[" "]")+
    & { return ["return"].indexOf(id.value) === -1; }
    { return type(id, ary); }

identifier
  = content:([a-zA-Z_][a-zA-Z_0-9]*)
    & { return RESERVED_WORDS.indexOf(flatten(content).join("")) === -1; }
    { return new AST.Identifier(text(), location()); }

type_identifier
  = content:([a-zA-Z_][a-zA-Z_0-9]*)
    & { return ["return"].indexOf(text()) === -1; }
    { return new AST.Identifier(text(), location()); }

nl
  = ("\r" / "\r\n" / "\n") { return null; }

_ "whitespace"
  = [ \t\n\r]*