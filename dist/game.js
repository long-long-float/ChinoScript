(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("./type");
var ASTNode = (function () {
    function ASTNode(location) {
        this.location = location;
        this._resultType = null;
    }
    Object.defineProperty(ASTNode.prototype, "resultType", {
        get: function () { return this._resultType; },
        enumerable: true,
        configurable: true
    });
    ASTNode.prototype.setResultType = function (type) {
        if (type !== null)
            this._resultType = type;
    };
    return ASTNode;
}());
exports.ASTNode = ASTNode;
var Statement = (function (_super) {
    __extends(Statement, _super);
    function Statement(location) {
        return _super.call(this, location) || this;
    }
    return Statement;
}(ASTNode));
exports.Statement = Statement;
var DefineVariable = (function (_super) {
    __extends(DefineVariable, _super);
    function DefineVariable(isEternal, type, name, length, initialValue, location) {
        var _this = _super.call(this, location) || this;
        _this.isEternal = isEternal;
        _this.type = type;
        _this.name = name;
        _this.length = length;
        _this.initialValue = initialValue;
        return _this;
    }
    DefineVariable.prototype.usingTypeInference = function () {
        return this.type.name === 'let';
    };
    DefineVariable.prototype.accept = function (visitor) {
        return visitor.visitDefineVariable(this);
    };
    return DefineVariable;
}(Statement));
exports.DefineVariable = DefineVariable;
var ReturnStatement = (function (_super) {
    __extends(ReturnStatement, _super);
    function ReturnStatement(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    ReturnStatement.prototype.accept = function (visitor) {
        return visitor.visitReturnStatement(this);
    };
    return ReturnStatement;
}(Statement));
exports.ReturnStatement = ReturnStatement;
var YieldStatement = (function (_super) {
    __extends(YieldStatement, _super);
    function YieldStatement(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    YieldStatement.prototype.accept = function (visitor) {
        return visitor.visitYieldStatement(this);
    };
    return YieldStatement;
}(Statement));
exports.YieldStatement = YieldStatement;
var BreakStatement = (function (_super) {
    __extends(BreakStatement, _super);
    function BreakStatement(location) {
        return _super.call(this, location) || this;
    }
    BreakStatement.prototype.accept = function (visitor) {
        return visitor.visitBreakStatement(this);
    };
    return BreakStatement;
}(Statement));
exports.BreakStatement = BreakStatement;
var ForStatement = (function (_super) {
    __extends(ForStatement, _super);
    function ForStatement(init, condition, update, block, location) {
        var _this = _super.call(this, location) || this;
        _this.init = init;
        _this.condition = condition;
        _this.update = update;
        _this.block = block;
        return _this;
    }
    ForStatement.prototype.accept = function (visitor) {
        return visitor.visitForStatement(this);
    };
    return ForStatement;
}(Statement));
exports.ForStatement = ForStatement;
var WhileStatement = (function (_super) {
    __extends(WhileStatement, _super);
    function WhileStatement(condition, block, location) {
        var _this = _super.call(this, location) || this;
        _this.condition = condition;
        _this.block = block;
        return _this;
    }
    WhileStatement.prototype.accept = function (visitor) {
        return visitor.visitWhileStatement(this);
    };
    return WhileStatement;
}(Statement));
exports.WhileStatement = WhileStatement;
var FunctionDefinition = (function (_super) {
    __extends(FunctionDefinition, _super);
    function FunctionDefinition(outputType, name, genericTypes, args, body, modifier, location) {
        var _this = _super.call(this, location) || this;
        _this.outputType = outputType;
        _this.name = name;
        _this.genericTypes = genericTypes;
        _this.args = args;
        _this.body = body;
        _this.modifier = modifier;
        if (_this.modifier === 'gen') {
            _this.outputType = new type_1.Type('Generator', [_this.outputType]);
        }
        return _this;
    }
    FunctionDefinition.prototype.accept = function (visitor) {
        return visitor.visitFunctionDefinition(this);
    };
    FunctionDefinition.prototype.isGenerics = function () { return this.genericTypes.length > 0; };
    FunctionDefinition.prototype.isGenerator = function () { return this.modifier === 'gen'; };
    return FunctionDefinition;
}(Statement));
exports.FunctionDefinition = FunctionDefinition;
var ArgumentDefinition = (function (_super) {
    __extends(ArgumentDefinition, _super);
    function ArgumentDefinition(type, name, location) {
        var _this = _super.call(this, location) || this;
        _this.type = type;
        _this.name = name;
        return _this;
    }
    ArgumentDefinition.prototype.accept = function (visitor) {
        return null;
    };
    return ArgumentDefinition;
}(ASTNode));
exports.ArgumentDefinition = ArgumentDefinition;
var Expression = (function (_super) {
    __extends(Expression, _super);
    function Expression(location) {
        return _super.call(this, location) || this;
    }
    return Expression;
}(ASTNode));
exports.Expression = Expression;
var LHExpression = (function (_super) {
    __extends(LHExpression, _super);
    function LHExpression(name, index, location) {
        var _this = _super.call(this, location) || this;
        _this.name = name;
        _this.index = index;
        return _this;
    }
    LHExpression.prototype.accept = function (visitor) {
        return null;
    };
    return LHExpression;
}(ASTNode));
exports.LHExpression = LHExpression;
var BinaryOpType;
(function (BinaryOpType) {
    BinaryOpType[BinaryOpType["Arith"] = 0] = "Arith";
    BinaryOpType[BinaryOpType["Pred"] = 1] = "Pred";
    BinaryOpType[BinaryOpType["Logic"] = 2] = "Logic";
    BinaryOpType[BinaryOpType["Unknown"] = 3] = "Unknown";
})(BinaryOpType = exports.BinaryOpType || (exports.BinaryOpType = {}));
var BinaryOp = (function (_super) {
    __extends(BinaryOp, _super);
    function BinaryOp(left, op, right, location) {
        var _this = _super.call(this, location) || this;
        _this.left = left;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    BinaryOp.prototype.accept = function (visitor) {
        return visitor.visitBinaryOp(this);
    };
    Object.defineProperty(BinaryOp.prototype, "type", {
        get: function () {
            switch (this.op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    return BinaryOpType.Arith;
                case '<=':
                case '>=':
                case '<':
                case '>':
                case '==':
                case '!=':
                    return BinaryOpType.Pred;
                case '||':
                case '&&':
                    return BinaryOpType.Logic;
                default:
                    return BinaryOpType.Unknown;
            }
        },
        enumerable: true,
        configurable: true
    });
    return BinaryOp;
}(Expression));
exports.BinaryOp = BinaryOp;
var Assign = (function (_super) {
    __extends(Assign, _super);
    function Assign(left, right, location) {
        var _this = _super.call(this, location) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    Assign.prototype.accept = function (visitor) {
        return visitor.visitAssign(this);
    };
    return Assign;
}(Expression));
exports.Assign = Assign;
var UnaryOpFront = (function (_super) {
    __extends(UnaryOpFront, _super);
    function UnaryOpFront(op, right, location) {
        var _this = _super.call(this, location) || this;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    UnaryOpFront.prototype.accept = function (visitor) {
        return visitor.visitUnaryOpFront(this);
    };
    return UnaryOpFront;
}(Expression));
exports.UnaryOpFront = UnaryOpFront;
var CallFunction = (function (_super) {
    __extends(CallFunction, _super);
    function CallFunction(name, args) {
        var _this = _super.call(this, name.location) || this;
        _this.name = name;
        _this.args = args;
        return _this;
    }
    CallFunction.prototype.accept = function (visitor) {
        return visitor.visitCallFunction(this);
    };
    return CallFunction;
}(Expression));
exports.CallFunction = CallFunction;
var ReferenceVariable = (function (_super) {
    __extends(ReferenceVariable, _super);
    function ReferenceVariable(name, index) {
        var _this = _super.call(this, name.location) || this;
        _this.name = name;
        _this.index = index;
        return _this;
    }
    ReferenceVariable.prototype.accept = function (visitor) {
        return visitor.visitReferenceVariable(this);
    };
    return ReferenceVariable;
}(Expression));
exports.ReferenceVariable = ReferenceVariable;
var IfExpression = (function (_super) {
    __extends(IfExpression, _super);
    function IfExpression(condition, thenBlock, elseBlock) {
        var _this = _super.call(this, condition.location) || this;
        _this.condition = condition;
        _this.thenBlock = thenBlock;
        _this.elseBlock = elseBlock;
        return _this;
    }
    IfExpression.prototype.accept = function (visitor) {
        return visitor.visitIfExpression(this);
    };
    return IfExpression;
}(Expression));
exports.IfExpression = IfExpression;
var IntegerLiteral = (function (_super) {
    __extends(IntegerLiteral, _super);
    function IntegerLiteral(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    IntegerLiteral.prototype.accept = function (visitor) {
        return visitor.visitIntegerLiteral(this);
    };
    return IntegerLiteral;
}(Expression));
exports.IntegerLiteral = IntegerLiteral;
var FloatLiteral = (function (_super) {
    __extends(FloatLiteral, _super);
    function FloatLiteral(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    FloatLiteral.prototype.accept = function (visitor) {
        return visitor.visitFloatLiteral(this);
    };
    return FloatLiteral;
}(Expression));
exports.FloatLiteral = FloatLiteral;
var BooleanLiteral = (function (_super) {
    __extends(BooleanLiteral, _super);
    function BooleanLiteral(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    BooleanLiteral.prototype.accept = function (visitor) {
        return visitor.visitBooleanLiteral(this);
    };
    return BooleanLiteral;
}(Expression));
exports.BooleanLiteral = BooleanLiteral;
var CharLiteral = (function (_super) {
    __extends(CharLiteral, _super);
    function CharLiteral(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
        // TODO: 1文字かチェック
    }
    CharLiteral.prototype.accept = function (visitor) {
        return visitor.visitCharLiteral(this);
    };
    return CharLiteral;
}(Expression));
exports.CharLiteral = CharLiteral;
var ArrayLiteral = (function (_super) {
    __extends(ArrayLiteral, _super);
    function ArrayLiteral(type, values, location) {
        var _this = _super.call(this, location) || this;
        _this.type = type;
        _this.values = values;
        return _this;
    }
    ArrayLiteral.prototype.accept = function (visitor) {
        return visitor.visitArrayLiteral(this);
    };
    return ArrayLiteral;
}(Expression));
exports.ArrayLiteral = ArrayLiteral;
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(statemetns, location) {
        var _this = _super.call(this, location) || this;
        _this.statemetns = statemetns;
        return _this;
    }
    Block.prototype.accept = function (visitor) {
        return visitor.visitBlock(this);
    };
    return Block;
}(Statement));
exports.Block = Block;
var Identifier = (function (_super) {
    __extends(Identifier, _super);
    function Identifier(value, location) {
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    Identifier.prototype.accept = function (visitor) {
        return visitor.visitIdentifier(this);
    };
    return Identifier;
}(ASTNode));
exports.Identifier = Identifier;

},{"./type":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST = require("./ast");
var op = require("./operation");
var stack_1 = require("./stack");
var environment_1 = require("./environment");
exports.DefaultFunName = '$main';
var Compiler = (function () {
    function Compiler() {
        this.labelCounter = 0;
        this.functions = (_a = {}, _a[exports.DefaultFunName] = [], _a);
        this.currentFunctionName = exports.DefaultFunName;
        this.functionDefinitions = {};
        this.variableEnv = new environment_1.Environment();
        this.variableCounts = (_b = {}, _b[exports.DefaultFunName] = 0, _b);
        this.globalEnv = new environment_1.Environment();
        this.globalVariableCount = 0;
        this.loopEndLabelStack = new stack_1.Stack();
        var _a, _b;
    }
    Compiler.prototype.compile = function (ast) {
        var _this = this;
        ast.forEach(function (stmt) {
            if (stmt instanceof AST.FunctionDefinition) {
                _this.functionDefinitions[stmt.name.value] = stmt;
            }
        });
        ast.forEach(function (stmt) {
            stmt.accept(_this);
        });
        return this.functions;
    };
    Compiler.prototype.addOperation = function (op) {
        this.functions[this.currentFunctionName].push(op);
    };
    Compiler.prototype.visitDefineVariable = function (node) {
        node.initialValue.accept(this);
        if (this.currentFunctionName === exports.DefaultFunName && this.variableEnv.count() === 1) {
            var id = this.defineGlobalVariable(node.name.value);
            this.addOperation(new op.Store(id, true));
        }
        else {
            var id = this.defineVariable(node.name.value);
            this.addOperation(new op.Store(id, false));
        }
    };
    Compiler.prototype.visitReturnStatement = function (node) {
        if (node.value !== null)
            node.value.accept(this);
        this.addOperation(new op.Ret());
    };
    Compiler.prototype.visitYieldStatement = function (node) {
        if (node.value !== null)
            node.value.accept(this);
        this.addOperation(new op.YieldRet());
    };
    Compiler.prototype.visitBreakStatement = function (node) {
        var label = this.loopEndLabelStack.top();
        this.addOperation(new op.Jump(label.id));
    };
    Compiler.prototype.visitForStatement = function (node) {
        node.init.accept(this);
        var headLabel = this.createLabel();
        var tailLabel = this.createLabel();
        this.addOperation(headLabel);
        node.condition.accept(this);
        this.addOperation(new op.JumpUnless(tailLabel.id));
        this.loopEndLabelStack.push(tailLabel);
        node.block.accept(this);
        this.loopEndLabelStack.pop();
        node.update.accept(this);
        this.addOperation(new op.Jump(headLabel.id));
        this.addOperation(tailLabel);
    };
    Compiler.prototype.visitWhileStatement = function (node) {
        var headLabel = this.createLabel();
        var tailLabel = this.createLabel();
        this.addOperation(headLabel);
        node.condition.accept(this);
        this.addOperation(new op.JumpUnless(tailLabel.id));
        this.loopEndLabelStack.push(tailLabel);
        node.block.accept(this);
        this.loopEndLabelStack.pop();
        this.addOperation(new op.Jump(headLabel.id));
        this.addOperation(tailLabel);
    };
    Compiler.prototype.visitFunctionDefinition = function (node) {
        var _this = this;
        var prevName = this.currentFunctionName;
        this.currentFunctionName = node.name.value;
        this.functions[this.currentFunctionName] = [];
        this.variableCounts[this.currentFunctionName] = 0;
        node.args.forEach(function (arg) {
            var id = _this.defineVariable(arg.name.value);
            _this.addOperation(new op.Store(id, false));
        });
        node.body.accept(this);
        // TODO: すでにRETがある場合は追加しないようにする
        this.addOperation(new op.Ret());
        this.currentFunctionName = prevName;
    };
    Compiler.prototype.visitAssign = function (node) {
        node.right.accept(this);
        var name = node.left.name.value;
        var _a = this.varIdByName(name), id = _a[0], global = _a[1];
        if (node.left.index !== null) {
            node.left.index.accept(this);
            this.addOperation(new op.StoreWithIndex(id, global));
        }
        else {
            this.addOperation(new op.Store(id, global));
        }
    };
    Compiler.prototype.visitBinaryOp = function (node) {
        if (op.isArithmeticOperation(node.op)) {
            node.left.accept(this);
            node.right.accept(this);
            var type = node.left.resultType;
            if (type !== null) {
                if (type.name === 'Integer') {
                    this.addOperation(new op.IArith(node.op));
                }
                else {
                    this.addOperation(new op.FArith(node.op));
                }
            }
            else {
                throw new Error('Bug');
            }
        }
        else if (op.isLogicalOperation(node.op)) {
            var elseLabel = this.createLabel();
            var endLabel = this.createLabel();
            // A && B
            //
            // A
            // JumpUnless else
            // B
            // Jump end
            // else:
            // push false
            // end:
            node.left.accept(this);
            if (node.op === '&&') {
                this.addOperation(new op.JumpUnless(elseLabel.id));
            }
            else {
                this.addOperation(new op.JumpIf(elseLabel.id));
            }
            node.right.accept(this);
            this.addOperation(new op.Jump(endLabel.id));
            this.addOperation(elseLabel);
            this.addOperation(new op.Push(node.op !== '&&'));
            this.addOperation(endLabel);
        }
        else {
            node.left.accept(this);
            node.right.accept(this);
            this.addOperation(new op.ICmp(node.op));
        }
    };
    Compiler.prototype.visitUnaryOpFront = function (node) {
        throw new Error("Method not implemented.");
    };
    Compiler.prototype.visitCallFunction = function (node) {
        var _this = this;
        node.args.forEach(function (arg) { return arg.accept(_this); });
        var target = this.functionDefinitions[node.name.value];
        if (target && target.isGenerator()) {
            this.addOperation(new op.InitGenerator(node.name.value, node.args.length));
        }
        else {
            this.addOperation(new op.CallFunction(node.name.value, node.args.length));
        }
    };
    Compiler.prototype.visitReferenceVariable = function (node) {
        var name = node.name.value;
        var _a = this.varIdByName(name), id = _a[0], global = _a[1];
        if (node.index !== null) {
            node.index.accept(this);
            this.addOperation(new op.LoadWithIndex(id, global));
        }
        else {
            this.addOperation(new op.Load(id, global));
        }
    };
    Compiler.prototype.visitIfExpression = function (node) {
        node.condition.accept(this);
        var elseLabel = this.createLabel();
        var endLabel = this.createLabel();
        this.addOperation(new op.JumpUnless(elseLabel.id));
        // then
        node.thenBlock.accept(this);
        this.addOperation(new op.Jump(endLabel.id));
        // else
        this.addOperation(elseLabel);
        if (node.elseBlock !== null) {
            node.elseBlock.accept(this);
        }
        this.addOperation(endLabel);
    };
    Compiler.prototype.visitIntegerLiteral = function (node) {
        this.addOperation(new op.Push(node.value));
    };
    Compiler.prototype.visitFloatLiteral = function (node) {
        this.addOperation(new op.Push(node.value));
    };
    Compiler.prototype.visitCharLiteral = function (node) {
        this.addOperation(new op.Push(node.value.charCodeAt(0)));
    };
    Compiler.prototype.visitBooleanLiteral = function (node) {
        this.addOperation(new op.Push(node.value));
    };
    Compiler.prototype.visitArrayLiteral = function (node) {
        var _this = this;
        node.values.forEach(function (value) { return value.accept(_this); });
        this.addOperation(new op.CallFunction('buildArray', node.values.length));
    };
    Compiler.prototype.visitBlock = function (node) {
        var _this = this;
        this.variableEnv.push();
        node.statemetns.forEach(function (stmt) { return stmt.accept(_this); });
        this.variableEnv.pop();
    };
    Compiler.prototype.visitIdentifier = function (node) {
        throw new Error("Method not implemented.");
    };
    Compiler.prototype.createLabel = function () {
        return new op.Label(this.labelCounter++);
    };
    Compiler.prototype.defineVariable = function (name) {
        var id = this.variableCounts[this.currentFunctionName];
        this.variableEnv.define(name, id);
        this.variableCounts[this.currentFunctionName]++;
        return id;
    };
    Compiler.prototype.defineGlobalVariable = function (name) {
        var id = this.globalVariableCount;
        this.globalEnv.define(name, id);
        this.globalVariableCount++;
        return id;
    };
    Compiler.prototype.varIdByName = function (name) {
        var id = this.variableEnv.reference(name);
        var global = false;
        if (id === null) {
            id = this.globalEnv.reference(name);
            global = true;
        }
        if (id === null)
            throw new Error('Bug');
        return [id, global];
    };
    return Compiler;
}());
exports.Compiler = Compiler;

},{"./ast":1,"./environment":3,"./operation":7,"./stack":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stack_1 = require("./stack");
var Environment = (function () {
    function Environment() {
        this.tableStack = new stack_1.Stack();
        this.push();
    }
    Environment.prototype.push = function (value) {
        if (value === void 0) { value = {}; }
        this.tableStack.push(value);
    };
    Environment.prototype.pop = function () {
        this.tableStack.pop();
    };
    Environment.prototype.define = function (name, value) {
        var table = this.tableStack.top();
        if (table.hasOwnProperty(name)) {
            return false;
        }
        table[name] = value;
        return true;
    };
    // with no checks
    Environment.prototype.store = function (name, value) {
        this.tableStack.top()[name] = value;
    };
    Environment.prototype.reference = function (name) {
        var table = this.tableStack.values.reverse().find(function (table) {
            return table.hasOwnProperty(name);
        });
        if (table !== undefined) {
            return table[name];
        }
        else {
            return null;
        }
    };
    Environment.prototype.count = function () {
        return this.tableStack.count();
    };
    return Environment;
}());
exports.Environment = Environment;

},{"./stack":9}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TypeError = (function (_super) {
    __extends(TypeError, _super);
    function TypeError(message, location) {
        var _this = _super.call(this, message) || this;
        _this.location = location;
        return _this;
    }
    TypeError.fromTypes = function (expect, actual, location) {
        return new TypeError("expected '" + expect.toString() + "', but '" + actual.toString() + "' given", location);
    };
    return TypeError;
}(Error));
exports.TypeError = TypeError;
var SyntaxError = (function (_super) {
    __extends(SyntaxError, _super);
    function SyntaxError(message, location) {
        var _this = _super.call(this, message) || this;
        _this.location = location;
        return _this;
    }
    return SyntaxError;
}(Error));
exports.SyntaxError = SyntaxError;
var UndefinedError = (function (_super) {
    __extends(UndefinedError, _super);
    function UndefinedError(name, location) {
        var _this = _super.call(this, name + " is not defined") || this;
        _this.location = location;
        return _this;
    }
    return UndefinedError;
}(Error));
exports.UndefinedError = UndefinedError;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChinoScript = require("./index");
var resultElem = document.getElementById('result');
var outputElem = document.getElementById('output');
console.log = function (text) {
    outputElem.value += text + '\n';
};
var errorElem = document.getElementById('error');
document.getElementById('run-button').addEventListener('click', function () {
    outputElem.value = '';
    var code = document.getElementById('src').value;
    try {
        resultElem.innerHTML = ChinoScript.valueToString(ChinoScript.evaluate(code, false));
    }
    catch (e) {
        errorElem.innerHTML = e.message;
    }
});

},{"./index":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require("./parser.js");
var compiler_1 = require("./compiler");
var type_checker_1 = require("./type-checker");
var vm_1 = require("./vm");
var Value = require("./value");
var Exceptions = require("./exception");
var type_1 = require("./type");
var util = require("util");
exports.exceptions = Exceptions;
function valueToString(value) {
    if (value instanceof Value.ChinoArray) {
        return value.values.map(function (ch) { return String.fromCharCode(ch); }).join('');
    }
    else {
        return value.toString();
    }
}
exports.valueToString = valueToString;
function valueToArray(value) {
    if (value instanceof Value.ChinoArray) {
        return value.values;
    }
    else {
        return undefined;
    }
}
exports.valueToArray = valueToArray;
function evaluate(code, debug) {
    if (debug === void 0) { debug = false; }
    var externalFunctions = [
        {
            name: 'ctoi',
            outputType: new type_1.Type('Integer', []),
            genericsTypes: [],
            argTypes: [new type_1.Type('Char', [])],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return args[0];
            }
        },
        {
            name: 'puts',
            outputType: new type_1.Type('Tuple', []),
            genericsTypes: ['T'],
            argTypes: [new type_1.Type('T', [])],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log(valueToString(args[0]));
                return null;
            }
        },
        {
            name: 'len',
            outputType: new type_1.Type('Integer', []),
            genericsTypes: ['T'],
            argTypes: [new type_1.Type('Array', [new type_1.Type('T', [])])],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var arg = args[0];
                if (!(arg instanceof Value.ChinoArray)) {
                    throw new Error('value must be array');
                }
                var t = arg;
                return t.length;
            }
        },
        {
            name: 'append',
            outputType: new type_1.Type('Tuple', []),
            genericsTypes: ['T'],
            argTypes: [new type_1.Type('Array', [new type_1.Type('T', [])]), new type_1.Type('T', [])],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var ary = args[0];
                var value = args[1];
                if (!(ary instanceof Value.ChinoArray)) {
                    throw new Error('value must be array');
                }
                var t = ary;
                t.values.push(value);
                t.length++;
                return null;
            }
        },
        {
            name: 'rand',
            outputType: new type_1.Type('Integer', []),
            genericsTypes: [],
            argTypes: [],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Math.floor(Math.random() * Math.pow(2, 31));
            }
        },
        {
            name: 'get_int',
            outputType: new type_1.Type('Integer', []),
            genericsTypes: [],
            argTypes: [],
            body: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var result = prompt('input');
                if (result !== null) {
                    return parseInt(result, 10);
                }
                else {
                    return 0;
                }
            }
        },
    ];
    var ast = parse(code);
    var typeChecker = new type_checker_1.TypeChecker();
    typeChecker.check(ast, externalFunctions);
    var ops = compile(ast);
    if (debug) {
        console.log(util.inspect(ast, false, null));
        console.log(ops);
    }
    var vm = new vm_1.VirtualMachine();
    return vm.run(ops, externalFunctions);
}
exports.evaluate = evaluate;
function parse(code) {
    return parser.parser.parse(code);
}
exports.parse = parse;
function compile(ast) {
    var compiler = new compiler_1.Compiler();
    return compiler.compile(ast);
}
exports.compile = compile;

},{"./compiler":2,"./exception":4,"./parser.js":8,"./type":11,"./type-checker":10,"./value":12,"./vm":13,"util":17}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Operation = (function () {
    function Operation() {
    }
    return Operation;
}());
exports.Operation = Operation;
var CallFunction = (function (_super) {
    __extends(CallFunction, _super);
    function CallFunction(name, argumentsLength) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.argumentsLength = argumentsLength;
        return _this;
    }
    return CallFunction;
}(Operation));
exports.CallFunction = CallFunction;
var InitGenerator = (function (_super) {
    __extends(InitGenerator, _super);
    function InitGenerator(name, argumentsLength) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.argumentsLength = argumentsLength;
        return _this;
    }
    return InitGenerator;
}(Operation));
exports.InitGenerator = InitGenerator;
var Push = (function (_super) {
    __extends(Push, _super);
    function Push(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return Push;
}(Operation));
exports.Push = Push;
var Store = (function (_super) {
    __extends(Store, _super);
    function Store(id, global) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.global = global;
        return _this;
    }
    return Store;
}(Operation));
exports.Store = Store;
var StoreWithIndex = (function (_super) {
    __extends(StoreWithIndex, _super);
    function StoreWithIndex(id, global) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.global = global;
        return _this;
    }
    return StoreWithIndex;
}(Operation));
exports.StoreWithIndex = StoreWithIndex;
var Load = (function (_super) {
    __extends(Load, _super);
    function Load(id, global) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.global = global;
        return _this;
    }
    return Load;
}(Operation));
exports.Load = Load;
var LoadWithIndex = (function (_super) {
    __extends(LoadWithIndex, _super);
    function LoadWithIndex(id, global) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.global = global;
        return _this;
    }
    return LoadWithIndex;
}(Operation));
exports.LoadWithIndex = LoadWithIndex;
function isArithmeticOperation(op) {
    return op === '+' || op === '-' || op === '*' || op === '/' || op === '%';
}
exports.isArithmeticOperation = isArithmeticOperation;
function isLogicalOperation(op) {
    return op === '||' || op === '&&';
}
exports.isLogicalOperation = isLogicalOperation;
var IArith = (function (_super) {
    __extends(IArith, _super);
    function IArith(operation) {
        var _this = _super.call(this) || this;
        _this.operation = operation;
        return _this;
    }
    return IArith;
}(Operation));
exports.IArith = IArith;
var FArith = (function (_super) {
    __extends(FArith, _super);
    function FArith(operation) {
        var _this = _super.call(this) || this;
        _this.operation = operation;
        return _this;
    }
    return FArith;
}(Operation));
exports.FArith = FArith;
var ICmp = (function (_super) {
    __extends(ICmp, _super);
    function ICmp(operation) {
        var _this = _super.call(this) || this;
        _this.operation = operation;
        return _this;
    }
    return ICmp;
}(Operation));
exports.ICmp = ICmp;
var Jump = (function (_super) {
    __extends(Jump, _super);
    function Jump(destination) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        return _this;
    }
    return Jump;
}(Operation));
exports.Jump = Jump;
var JumpIf = (function (_super) {
    __extends(JumpIf, _super);
    function JumpIf(destination) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        return _this;
    }
    return JumpIf;
}(Operation));
exports.JumpIf = JumpIf;
var JumpUnless = (function (_super) {
    __extends(JumpUnless, _super);
    function JumpUnless(destination) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        return _this;
    }
    return JumpUnless;
}(Operation));
exports.JumpUnless = JumpUnless;
var Ret = (function (_super) {
    __extends(Ret, _super);
    function Ret() {
        return _super.call(this) || this;
    }
    return Ret;
}(Operation));
exports.Ret = Ret;
var YieldRet = (function (_super) {
    __extends(YieldRet, _super);
    function YieldRet() {
        return _super.call(this) || this;
    }
    return YieldRet;
}(Operation));
exports.YieldRet = YieldRet;
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    return Label;
}(Operation));
exports.Label = Label;

},{}],8:[function(require,module,exports){
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function(root) {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { program: peg$parseprogram },
        peg$startRuleFunction  = peg$parseprogram,

        peg$c0 = function(program) { return filter(flatten(program)); },
        peg$c1 = "<",
        peg$c2 = peg$literalExpectation("<", false),
        peg$c3 = ",",
        peg$c4 = peg$literalExpectation(",", false),
        peg$c5 = ">",
        peg$c6 = peg$literalExpectation(">", false),
        peg$c7 = "(",
        peg$c8 = peg$literalExpectation("(", false),
        peg$c9 = ")",
        peg$c10 = peg$literalExpectation(")", false),
        peg$c11 = "gen",
        peg$c12 = peg$literalExpectation("gen", false),
        peg$c13 = "suffix",
        peg$c14 = peg$literalExpectation("suffix", false),
        peg$c15 = function(type, name, generic_types, fst_arg, rest_args, modifier, block) {
              const gt = filter(flatten(generic_types || []))
              gt.shift()
              gt.pop()
              return new AST.FunctionDefinition(type, name, gt, args(fst_arg, rest_args), block, modifier, location());
            },
        peg$c16 = function(type, name) { return new AST.ArgumentDefinition(type, name, location()); },
        peg$c17 = ";",
        peg$c18 = peg$literalExpectation(";", false),
        peg$c19 = function(expr) { return expr },
        peg$c20 = "eternal",
        peg$c21 = peg$literalExpectation("eternal", false),
        peg$c22 = "[",
        peg$c23 = peg$literalExpectation("[", false),
        peg$c24 = "]",
        peg$c25 = peg$literalExpectation("]", false),
        peg$c26 = "=",
        peg$c27 = peg$literalExpectation("=", false),
        peg$c28 = function(eternal, type, name, length, init_value) { return new AST.DefineVariable(eternal !== null, type, name, length !== null ? length[1] : null, init_value[2], location()); },
        peg$c29 = "return",
        peg$c30 = peg$literalExpectation("return", false),
        peg$c31 = function(value) { return new AST.ReturnStatement(value, location()); },
        peg$c32 = "break",
        peg$c33 = peg$literalExpectation("break", false),
        peg$c34 = function() { return new AST.BreakStatement(location()); },
        peg$c35 = "yield",
        peg$c36 = peg$literalExpectation("yield", false),
        peg$c37 = function(value) { return new AST.YieldStatement(value); },
        peg$c38 = "for",
        peg$c39 = peg$literalExpectation("for", false),
        peg$c40 = function(init, cond, update, block) { return new AST.ForStatement(init, cond, update, block, location()); },
        peg$c41 = "while",
        peg$c42 = peg$literalExpectation("while", false),
        peg$c43 = function(cond, block) { return new AST.WhileStatement(cond, block, location()); },
        peg$c44 = function(left, rest) { return binary_op(left, rest); },
        peg$c45 = "+=",
        peg$c46 = peg$literalExpectation("+=", false),
        peg$c47 = "-=",
        peg$c48 = peg$literalExpectation("-=", false),
        peg$c49 = "*=",
        peg$c50 = peg$literalExpectation("*=", false),
        peg$c51 = "/=",
        peg$c52 = peg$literalExpectation("/=", false),
        peg$c53 = "%=",
        peg$c54 = peg$literalExpectation("%=", false),
        peg$c55 = function(left, rest) { return combined_binary_op(left, rest); },
        peg$c56 = function(id, index) { return new AST.LHExpression(id, index ? index[3] : null, location()); },
        peg$c57 = "||",
        peg$c58 = peg$literalExpectation("||", false),
        peg$c59 = "&&",
        peg$c60 = peg$literalExpectation("&&", false),
        peg$c61 = "<=",
        peg$c62 = peg$literalExpectation("<=", false),
        peg$c63 = ">=",
        peg$c64 = peg$literalExpectation(">=", false),
        peg$c65 = "==",
        peg$c66 = peg$literalExpectation("==", false),
        peg$c67 = "!=",
        peg$c68 = peg$literalExpectation("!=", false),
        peg$c69 = "+",
        peg$c70 = peg$literalExpectation("+", false),
        peg$c71 = "-",
        peg$c72 = peg$literalExpectation("-", false),
        peg$c73 = "*",
        peg$c74 = peg$literalExpectation("*", false),
        peg$c75 = "/",
        peg$c76 = peg$literalExpectation("/", false),
        peg$c77 = "%",
        peg$c78 = peg$literalExpectation("%", false),
        peg$c79 = function(op, val) { return unary_op_f(op, val); },
        peg$c80 = function(expr) { return expr; },
        peg$c81 = function(name, fst_arg, rest_args) { return new AST.CallFunction(name, args(fst_arg, rest_args)); },
        peg$c82 = function(expr, suffix) { return new AST.CallFunction(suffix, [expr]) },
        peg$c83 = function(id, index) { return new AST.ReferenceVariable(id, index !== null ? index[3] : null); },
        peg$c84 = "\"",
        peg$c85 = peg$literalExpectation("\"", false),
        peg$c86 = /^[^"]/,
        peg$c87 = peg$classExpectation(["\""], true, false),
        peg$c88 = function(value) { return string(value); },
        peg$c89 = "'",
        peg$c90 = peg$literalExpectation("'", false),
        peg$c91 = peg$anyExpectation(),
        peg$c92 = function(value) { return new AST.CharLiteral(value, location()); },
        peg$c93 = "true",
        peg$c94 = peg$literalExpectation("true", false),
        peg$c95 = "false",
        peg$c96 = peg$literalExpectation("false", false),
        peg$c97 = function(value) { return new AST.BooleanLiteral(value === 'true', location()); },
        peg$c98 = /^[0-9]/,
        peg$c99 = peg$classExpectation([["0", "9"]], false, false),
        peg$c100 = function() { return new AST.IntegerLiteral(parseInt(text(), 10), location()); },
        peg$c101 = ".",
        peg$c102 = peg$literalExpectation(".", false),
        peg$c103 = function(left, right) { return new AST.FloatLiteral(parseFloat(text()), location()); },
        peg$c104 = "if",
        peg$c105 = peg$literalExpectation("if", false),
        peg$c106 = "else",
        peg$c107 = peg$literalExpectation("else", false),
        peg$c108 = function(cond, iftrue, iffalse) { return new AST.IfExpression(cond, iftrue, iffalse !== null ? iffalse[3] : null); },
        peg$c109 = "{",
        peg$c110 = peg$literalExpectation("{", false),
        peg$c111 = "}",
        peg$c112 = peg$literalExpectation("}", false),
        peg$c113 = function(type, fst_value, values) {
              return new AST.ArrayLiteral(type,
                fst_value ?
                  [fst_value].concat(values.map(function(value) { return value[3]; })) :
                  []);
            },
        peg$c114 = function(stmts) { return new AST.Block(filter(flatten(stmts)), location()); },
        peg$c115 = function(stmt) { return new AST.Block([stmt], location()); },
        peg$c116 = "//",
        peg$c117 = peg$literalExpectation("//", false),
        peg$c118 = /^[^\n\r]/,
        peg$c119 = peg$classExpectation(["\n", "\r"], true, false),
        peg$c120 = function() { return null; },
        peg$c121 = function(id, ary) { return ["return"].indexOf(id.value) === -1; },
        peg$c122 = function(id, ary) { return type(id, ary); },
        peg$c123 = /^[a-zA-Z_]/,
        peg$c124 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
        peg$c125 = /^[a-zA-Z_0-9]/,
        peg$c126 = peg$classExpectation([["a", "z"], ["A", "Z"], "_", ["0", "9"]], false, false),
        peg$c127 = function(content) { return RESERVED_WORDS.indexOf(flatten(content).join("")) === -1; },
        peg$c128 = function(content) { return new AST.Identifier(text(), location()); },
        peg$c129 = function(content) { return ["return"].indexOf(text()) === -1; },
        peg$c130 = "\r",
        peg$c131 = peg$literalExpectation("\r", false),
        peg$c132 = "\r\n",
        peg$c133 = peg$literalExpectation("\r\n", false),
        peg$c134 = "\n",
        peg$c135 = peg$literalExpectation("\n", false),
        peg$c136 = peg$otherExpectation("whitespace"),
        peg$c137 = /^[ \t\n\r]/,
        peg$c138 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$resultsCache = {},

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseprogram() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 36 + 0,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parsetop_statement();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$parsetop_statement();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetop_statement() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 1,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsestatement();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsecomment();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsedef_fun();
        if (s0 === peg$FAILED) {
          s0 = peg$parsecomment();
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedef_fun() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;

      var key    = peg$currPos * 36 + 2,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsetype();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseidentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 60) {
                s6 = peg$c1;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c2); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseidentifier();
                if (s7 !== peg$FAILED) {
                  s8 = [];
                  s9 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s10 = peg$c3;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c4); }
                  }
                  if (s10 !== peg$FAILED) {
                    s11 = peg$parse_();
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parseidentifier();
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parse_();
                        if (s13 !== peg$FAILED) {
                          s10 = [s10, s11, s12, s13];
                          s9 = s10;
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                  while (s9 !== peg$FAILED) {
                    s8.push(s9);
                    s9 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s10 = peg$c3;
                      peg$currPos++;
                    } else {
                      s10 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c4); }
                    }
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parse_();
                      if (s11 !== peg$FAILED) {
                        s12 = peg$parseidentifier();
                        if (s12 !== peg$FAILED) {
                          s13 = peg$parse_();
                          if (s13 !== peg$FAILED) {
                            s10 = [s10, s11, s12, s13];
                            s9 = s10;
                          } else {
                            peg$currPos = s9;
                            s9 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 62) {
                      s9 = peg$c5;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s9 !== peg$FAILED) {
                      s6 = [s6, s7, s8, s9];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 40) {
                    s7 = peg$c7;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c8); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsedef_arg();
                      if (s9 === peg$FAILED) {
                        s9 = null;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$currPos;
                        s12 = peg$parse_();
                        if (s12 !== peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 44) {
                            s13 = peg$c3;
                            peg$currPos++;
                          } else {
                            s13 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c4); }
                          }
                          if (s13 !== peg$FAILED) {
                            s14 = peg$parse_();
                            if (s14 !== peg$FAILED) {
                              s15 = peg$parsedef_arg();
                              if (s15 !== peg$FAILED) {
                                s12 = [s12, s13, s14, s15];
                                s11 = s12;
                              } else {
                                peg$currPos = s11;
                                s11 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s11;
                              s11 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s11;
                            s11 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s11;
                          s11 = peg$FAILED;
                        }
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$currPos;
                          s12 = peg$parse_();
                          if (s12 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 44) {
                              s13 = peg$c3;
                              peg$currPos++;
                            } else {
                              s13 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c4); }
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parse_();
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsedef_arg();
                                if (s15 !== peg$FAILED) {
                                  s12 = [s12, s13, s14, s15];
                                  s11 = s12;
                                } else {
                                  peg$currPos = s11;
                                  s11 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s11;
                                s11 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s11;
                              s11 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s11;
                            s11 = peg$FAILED;
                          }
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parse_();
                          if (s11 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                              s12 = peg$c9;
                              peg$currPos++;
                            } else {
                              s12 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c10); }
                            }
                            if (s12 !== peg$FAILED) {
                              s13 = peg$parse_();
                              if (s13 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c11) {
                                  s14 = peg$c11;
                                  peg$currPos += 3;
                                } else {
                                  s14 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c12); }
                                }
                                if (s14 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 6) === peg$c13) {
                                    s14 = peg$c13;
                                    peg$currPos += 6;
                                  } else {
                                    s14 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c14); }
                                  }
                                }
                                if (s14 === peg$FAILED) {
                                  s14 = null;
                                }
                                if (s14 !== peg$FAILED) {
                                  s15 = peg$parse_();
                                  if (s15 !== peg$FAILED) {
                                    s16 = peg$parseblock();
                                    if (s16 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c15(s1, s3, s5, s9, s10, s14, s16);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedef_arg() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 3,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsetype();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseidentifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c16(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestatement() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 4,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$parsedef_var();
      if (s0 === peg$FAILED) {
        s0 = peg$parsereturn_stmt();
        if (s0 === peg$FAILED) {
          s0 = peg$parsebreak_stmt();
          if (s0 === peg$FAILED) {
            s0 = peg$parseyield_stmt();
            if (s0 === peg$FAILED) {
              s0 = peg$parsefor_stmt();
              if (s0 === peg$FAILED) {
                s0 = peg$parsewhile_stmt();
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parseexpression();
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 59) {
                        s3 = peg$c17;
                        peg$currPos++;
                      } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c18); }
                      }
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c19(s1);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                }
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedef_var() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

      var key    = peg$currPos * 36 + 5,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsetype();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseidentifier();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 91) {
                    s8 = peg$c22;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c23); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseinteger();
                    if (s9 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 93) {
                        s10 = peg$c24;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c25); }
                      }
                      if (s10 !== peg$FAILED) {
                        s8 = [s8, s9, s10];
                        s7 = s8;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 61) {
                        s10 = peg$c26;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c27); }
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parse_();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parseexpression();
                          if (s12 !== peg$FAILED) {
                            s10 = [s10, s11, s12];
                            s9 = s10;
                          } else {
                            peg$currPos = s9;
                            s9 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 59) {
                            s11 = peg$c17;
                            peg$currPos++;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c18); }
                          }
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c28(s1, s3, s5, s7, s9);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsereturn_stmt() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 36 + 6,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c29) {
        s1 = peg$c29;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexpression();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c17;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c18); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c31(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsebreak_stmt() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 7,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c32) {
        s1 = peg$c32;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 59) {
            s3 = peg$c17;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c18); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c34();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseyield_stmt() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 36 + 8,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c35) {
        s1 = peg$c35;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexpression();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c17;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c18); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c37(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefor_stmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

      var key    = peg$currPos * 36 + 9,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c38) {
        s1 = peg$c38;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsedef_var();
              if (s5 === peg$FAILED) {
                s5 = peg$currPos;
                s6 = peg$parseexpression();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s8 = peg$c17;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c18); }
                    }
                    if (s8 !== peg$FAILED) {
                      s6 = [s6, s7, s8];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseexpression();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 59) {
                        s9 = peg$c17;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c18); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseexpression();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parse_();
                            if (s12 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 41) {
                                s13 = peg$c9;
                                peg$currPos++;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c10); }
                              }
                              if (s13 !== peg$FAILED) {
                                s14 = peg$parse_();
                                if (s14 !== peg$FAILED) {
                                  s15 = peg$parseblock();
                                  if (s15 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c40(s5, s7, s11, s15);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsewhile_stmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      var key    = peg$currPos * 36 + 10,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c41) {
        s1 = peg$c41;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseexpression();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseblock();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c43(s5, s9);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseexpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 11,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parselh_expression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s5 = peg$c26;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseterm0();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c26;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c27); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseterm0();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parselh_expression();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c45) {
              s4 = peg$c45;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c46); }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c47) {
                s4 = peg$c47;
                peg$currPos += 2;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c48); }
              }
              if (s4 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c49) {
                  s4 = peg$c49;
                  peg$currPos += 2;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c50); }
                }
                if (s4 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c51) {
                    s4 = peg$c51;
                    peg$currPos += 2;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c52); }
                  }
                  if (s4 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c53) {
                      s4 = peg$c53;
                      peg$currPos += 2;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c54); }
                    }
                  }
                }
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseterm0();
                if (s6 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseterm0();
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parselh_expression() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      var key    = peg$currPos * 36 + 12,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseidentifier();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 91) {
            s4 = peg$c22;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseexpression();
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s8 = peg$c24;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c25); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parse_();
                    if (s9 !== peg$FAILED) {
                      s3 = [s3, s4, s5, s6, s7, s8, s9];
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c56(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseterm0() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 13,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseterm1();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c57) {
            s5 = peg$c57;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseterm1();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c57) {
                s5 = peg$c57;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c58); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseterm1();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseterm1();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseterm1() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 14,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseterm2();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c59) {
            s5 = peg$c59;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c60); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseterm2();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s5 = peg$c59;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseterm2();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseterm2();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseterm2() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 15,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseterm3();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c61) {
            s5 = peg$c61;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c62); }
          }
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c63) {
              s5 = peg$c63;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c64); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 60) {
                s5 = peg$c1;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c2); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s5 = peg$c5;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c6); }
                }
                if (s5 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c65) {
                    s5 = peg$c65;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c66); }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c67) {
                      s5 = peg$c67;
                      peg$currPos += 2;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c68); }
                    }
                  }
                }
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseterm3();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c61) {
                s5 = peg$c61;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c62); }
              }
              if (s5 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c63) {
                  s5 = peg$c63;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c64); }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 60) {
                    s5 = peg$c1;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c2); }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 62) {
                      s5 = peg$c5;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s5 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c65) {
                        s5 = peg$c65;
                        peg$currPos += 2;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c66); }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c67) {
                          s5 = peg$c67;
                          peg$currPos += 2;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c68); }
                        }
                      }
                    }
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseterm3();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseterm3();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseterm3() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 16,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseterm4();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 43) {
            s5 = peg$c69;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c70); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
              s5 = peg$c71;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c72); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseterm4();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 43) {
                s5 = peg$c69;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                  s5 = peg$c71;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c72); }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseterm4();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseterm4();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseterm4() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 36 + 17,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseunary();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 42) {
            s5 = peg$c73;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c74); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s5 = peg$c75;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c76); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 37) {
                s5 = peg$c77;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c78); }
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseunary();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 42) {
                s5 = peg$c73;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c74); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                  s5 = peg$c75;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c76); }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 37) {
                    s5 = peg$c77;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c78); }
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseunary();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseunary();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseunary() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 18,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c71;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s1 = peg$c69;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c70); }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefactor();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c79(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsefactor();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefactor() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

      var key    = peg$currPos * 36 + 19,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c80(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseif_expr();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseidentifier();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c7;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseexpression();
                  if (s5 === peg$FAILED) {
                    s5 = null;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = [];
                    s7 = peg$currPos;
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s9 = peg$c3;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c4); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseexpression();
                          if (s11 !== peg$FAILED) {
                            s8 = [s8, s9, s10, s11];
                            s7 = s8;
                          } else {
                            peg$currPos = s7;
                            s7 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s7;
                          s7 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                    while (s7 !== peg$FAILED) {
                      s6.push(s7);
                      s7 = peg$currPos;
                      s8 = peg$parse_();
                      if (s8 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                          s9 = peg$c3;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c4); }
                        }
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parse_();
                          if (s10 !== peg$FAILED) {
                            s11 = peg$parseexpression();
                            if (s11 !== peg$FAILED) {
                              s8 = [s8, s9, s10, s11];
                              s7 = s8;
                            } else {
                              peg$currPos = s7;
                              s7 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s7;
                            s7 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s7;
                          s7 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s8 = peg$c9;
                          peg$currPos++;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c10); }
                        }
                        if (s8 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c81(s1, s5, s6);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseliteral();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseidentifier();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c82(s1, s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseliteral();
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseidentifier();
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$parse_();
                  if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 91) {
                      s4 = peg$c22;
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c23); }
                    }
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parse_();
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parseexpression();
                        if (s6 !== peg$FAILED) {
                          s7 = peg$parse_();
                          if (s7 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 93) {
                              s8 = peg$c24;
                              peg$currPos++;
                            } else {
                              s8 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c25); }
                            }
                            if (s8 !== peg$FAILED) {
                              s9 = peg$parse_();
                              if (s9 !== peg$FAILED) {
                                s3 = [s3, s4, s5, s6, s7, s8, s9];
                                s2 = s3;
                              } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s2;
                              s2 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s2;
                          s2 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                  if (s2 === peg$FAILED) {
                    s2 = null;
                  }
                  if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c83(s1, s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseliteral() {
      var s0;

      var key    = peg$currPos * 36 + 20,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$parsefloat();
      if (s0 === peg$FAILED) {
        s0 = peg$parseinteger();
        if (s0 === peg$FAILED) {
          s0 = peg$parsestring();
          if (s0 === peg$FAILED) {
            s0 = peg$parsechar();
            if (s0 === peg$FAILED) {
              s0 = peg$parseboolean();
              if (s0 === peg$FAILED) {
                s0 = peg$parsearray();
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 21,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c84;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c86.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c87); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c86.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c87); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c84;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c85); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c88(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 22,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c89;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c91); }
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c89;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c90); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c92(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseboolean() {
      var s0, s1;

      var key    = peg$currPos * 36 + 23,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c93) {
        s1 = peg$c93;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c95) {
          s1 = peg$c95;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c96); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c97(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1, s2;

      var key    = peg$currPos * 36 + 24,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      if (peg$c98.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c98.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c99); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c100();
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefloat() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 36 + 25,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      if (peg$c98.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c98.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c99); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c101;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c102); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c98.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c99); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c98.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c99); }
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c103(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseif_expr() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

      var key    = peg$currPos * 36 + 26,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c104) {
        s1 = peg$c104;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c105); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseexpression();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseblock();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$currPos;
                        s11 = peg$parse_();
                        if (s11 !== peg$FAILED) {
                          if (input.substr(peg$currPos, 4) === peg$c106) {
                            s12 = peg$c106;
                            peg$currPos += 4;
                          } else {
                            s12 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c107); }
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parse_();
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parseblock();
                              if (s14 !== peg$FAILED) {
                                s11 = [s11, s12, s13, s14];
                                s10 = s11;
                              } else {
                                peg$currPos = s10;
                                s10 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s10;
                              s10 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s10;
                            s10 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                        if (s10 === peg$FAILED) {
                          s10 = null;
                        }
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c108(s5, s9, s10);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

      var key    = peg$currPos * 36 + 27,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsearray_type();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 123) {
            s3 = peg$c109;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c110); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseexpression();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$currPos;
                s8 = peg$parse_();
                if (s8 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s9 = peg$c3;
                    peg$currPos++;
                  } else {
                    s9 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c4); }
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parse_();
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parseexpression();
                      if (s11 !== peg$FAILED) {
                        s8 = [s8, s9, s10, s11];
                        s7 = s8;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$currPos;
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s9 = peg$c3;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c4); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseexpression();
                        if (s11 !== peg$FAILED) {
                          s8 = [s8, s9, s10, s11];
                          s7 = s8;
                        } else {
                          peg$currPos = s7;
                          s7 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c111;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c112); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c113(s1, s5, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseblock() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      var key    = peg$currPos * 36 + 28,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c109;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsecomment();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$currPos;
              s7 = peg$parsestatement();
              if (s7 !== peg$FAILED) {
                s8 = peg$parse_();
                if (s8 !== peg$FAILED) {
                  s9 = peg$parsecomment();
                  if (s9 === peg$FAILED) {
                    s9 = null;
                  }
                  if (s9 !== peg$FAILED) {
                    s7 = [s7, s8, s9];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              if (s6 === peg$FAILED) {
                s6 = peg$parsecomment();
              }
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$currPos;
                s7 = peg$parsestatement();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsecomment();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s7 = [s7, s8, s9];
                      s6 = s7;
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
                if (s6 === peg$FAILED) {
                  s6 = peg$parsecomment();
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c111;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c112); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c114(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsestatement();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c115(s1);
        }
        s0 = s1;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 36 + 29,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c116) {
        s1 = peg$c116;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c118.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c119); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c118.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c119); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c120();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetype() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 36 + 30,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsetype_identifier();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 91) {
            s5 = peg$c22;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s5 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s6 = peg$c24;
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 91) {
              s5 = peg$c22;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c23); }
            }
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s6 = peg$c24;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c25); }
              }
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = peg$currPos;
          s3 = peg$c121(s1, s2);
          if (s3) {
            s3 = void 0;
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c122(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_type() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 36 + 31,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsetype_identifier();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 91) {
            s5 = peg$c22;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s5 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s6 = peg$c24;
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 91) {
                s5 = peg$c22;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c23); }
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s6 = peg$c24;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c25); }
                }
                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = peg$currPos;
          s3 = peg$c121(s1, s2);
          if (s3) {
            s3 = void 0;
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c122(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseidentifier() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 36 + 32,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (peg$c123.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c124); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c125.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c126); }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c125.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c126); }
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = peg$currPos;
        s2 = peg$c127(s1);
        if (s2) {
          s2 = void 0;
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c128(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetype_identifier() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 36 + 33,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (peg$c123.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c124); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c125.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c126); }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c125.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c126); }
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = peg$currPos;
        s2 = peg$c129(s1);
        if (s2) {
          s2 = void 0;
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c128(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsenl() {
      var s0, s1;

      var key    = peg$currPos * 36 + 34,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 13) {
        s1 = peg$c130;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c131); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c132) {
          s1 = peg$c132;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c133); }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s1 = peg$c134;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c135); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c120();
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      var key    = peg$currPos * 36 + 35,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

        return cached.result;
      }

      peg$silentFails++;
      s0 = [];
      if (peg$c137.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c138); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c137.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c138); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c136); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }


      const AST = require('./ast.js')
      const Types = require('./type.js')

      const RESERVED_WORDS = ["return", "int", "string", "char", "float", "void", "for", "while", "if", "let"];

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
          'int': 'Integer', 'bool': 'Boolean', 'char': 'Char', 'string': 'String', 'float': 'Float'
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


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  root.parser = {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})(this);

},{"./ast.js":1,"./type.js":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stack = (function () {
    function Stack() {
        this._values = [];
    }
    Object.defineProperty(Stack.prototype, "values", {
        get: function () { return this._values.slice(); },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.push = function (value) {
        this._values.push(value);
    };
    Stack.prototype.pop = function () {
        var result = this._values.pop();
        if (result === undefined) {
            throw new Error('stack is empty');
        }
        return result;
    };
    Stack.prototype.top = function () {
        return this._values[this._values.length - 1];
    };
    Stack.prototype.bottom = function () {
        return this._values[0];
    };
    Stack.prototype.count = function () {
        return this._values.length;
    };
    return Stack;
}());
exports.Stack = Stack;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST = require("./ast");
var type_1 = require("./type");
var exception_1 = require("./exception");
var environment_1 = require("./environment");
var TypeChecker = (function () {
    function TypeChecker() {
        this.variableEnv = new environment_1.Environment();
        this.currentFunctionName = '';
        this.functions = {};
        this.externalFunctions = {};
    }
    TypeChecker.prototype.check = function (ast, externalFunctions) {
        var _this = this;
        externalFunctions.forEach(function (ext) {
            _this.externalFunctions[ext.name] = ext;
        });
        this.variableEnv.push();
        ast.forEach(function (stmt) {
            if (stmt instanceof AST.FunctionDefinition) {
                _this.functions[stmt.name.value] = stmt;
            }
        });
        ast.forEach(function (stmt) { return stmt.accept(_this); });
    };
    TypeChecker.prototype.visitDefineVariable = function (node) {
        var initType = node.initialValue.accept(this);
        var variableType = node.usingTypeInference() ? initType : node.type;
        var name = node.name.value;
        if (!this.variableEnv.define(name, variableType)) {
            throw new exception_1.SyntaxError(name + " has already defined", node.name.location);
        }
        if (!node.usingTypeInference()) {
            this.checkSatisfied(variableType, initType, node.location);
        }
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitReturnStatement = function (node) {
        var retType = node.value !== null ? node.value.accept(this) : new type_1.Type('Tuple', []);
        this.checkSatisfied(this.functions[this.currentFunctionName].outputType, retType, node.location);
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitYieldStatement = function (node) {
        var retType = node.value !== null ? node.value.accept(this) : new type_1.Type('Tuple', []);
        this.checkSatisfied(this.functions[this.currentFunctionName].outputType, new type_1.Type('Generator', [retType]), node.location);
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitBreakStatement = function (node) {
        // TODO: ループ内でしか使えないようにチェック
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitFunctionDefinition = function (node) {
        if (!node.isGenerics()) {
            this.defineFunction(node, null);
        }
        else {
            // do nothing
        }
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitForStatement = function (node) {
        node.init.accept(this);
        var conditionType = node.condition.accept(this);
        this.checkSatisfied(new type_1.Type('Boolean', []), conditionType, node.condition.location);
        node.update.accept(this);
        node.block.accept(this);
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitWhileStatement = function (node) {
        var conditionType = node.condition.accept(this);
        this.checkSatisfied(new type_1.Type('Boolean', []), conditionType, node.condition.location);
        node.block.accept(this);
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitAssign = function (node) {
        var leftType = this.variableEnv.reference(node.left.name.value);
        var rightType = node.right.accept(this);
        if (leftType === null) {
            throw new exception_1.UndefinedError(node.left.name.value, node.location);
        }
        if (node.left.index !== null) {
            this.checkSatisfied(new type_1.Type('Array', []), leftType, node.left.location, true);
            this.checkSatisfied(leftType.innerTypes[0], rightType, node.right.location);
        }
        else {
            this.checkSatisfied(leftType, rightType, node.right.location);
        }
        return new type_1.Type('Tuple', []);
    };
    TypeChecker.prototype.visitBinaryOp = function (node) {
        var leftType = node.left.accept(this);
        var rightType = node.right.accept(this);
        this.checkEquals(leftType, rightType, node.location);
        var expectedType = null;
        if (node.type === AST.BinaryOpType.Logic) {
            expectedType = new type_1.Type('Boolean', []);
        }
        else {
            if (node.op === '==' || node.op === '!=') {
                expectedType = rightType;
            }
        }
        if (expectedType !== null) {
            this.checkSatisfied(expectedType, leftType, node.location);
        }
        else {
            if (!leftType.equals(new type_1.Type('Integer', [])) && !leftType.equals(new type_1.Type('Float', []))) {
                throw new exception_1.TypeError("expected 'Integer' or 'Float', but '" + leftType.toString() + "' given", node.location);
            }
        }
        var resultType;
        if (node.type === AST.BinaryOpType.Arith) {
            resultType = leftType;
        }
        else {
            resultType = new type_1.Type('Boolean', []);
        }
        node.left.setResultType(leftType);
        node.right.setResultType(rightType);
        return resultType;
    };
    TypeChecker.prototype.visitUnaryOpFront = function (node) {
        throw new Error("Method not implemented.");
    };
    TypeChecker.prototype.visitCallFunction = function (node) {
        var _this = this;
        if (this.externalFunctions.hasOwnProperty(node.name.value)) {
            var target_1 = this.externalFunctions[node.name.value];
            if (target_1.argTypes.length !== node.args.length) {
                throw new exception_1.TypeError("wrong number of arguments (given " + node.args.length + ", expected " + target_1.argTypes.length + ")", node.location);
            }
            var genericsTable_1 = {};
            target_1.argTypes.forEach(function (expected, i) {
                var arg = node.args[i].accept(_this);
                if (target_1.genericsTypes.length > 0 && target_1.genericsTypes.some(function (n) { return expected.includes(n); })) {
                    var genericsName = expected.name;
                    if (!genericsTable_1.hasOwnProperty(genericsName)) {
                        genericsTable_1[genericsName] = arg;
                    }
                    _this.checkSatisfied(genericsTable_1[genericsName], arg, node.args[i].location);
                }
                else {
                    _this.checkSatisfied(expected, arg, node.args[i].location);
                }
            });
            return target_1.outputType;
        }
        else if (node.name.value === 'next') {
            var arg = node.args[0].accept(this);
            this.checkSatisfied(new type_1.Type('Generator', []), arg, node.args[0].location, true);
            return arg.innerTypes[0];
        }
        else {
            if (!this.functions.hasOwnProperty(node.name.value)) {
                throw new exception_1.SyntaxError(node.name.value + " is not defined", node.location);
            }
            var target_2 = this.functions[node.name.value];
            if (target_2.args.length !== node.args.length) {
                throw new exception_1.TypeError("wrong number of arguments (given " + node.args.length + ", expected " + target_2.args.length + ")", node.location);
            }
            var genericsTable_2 = {};
            target_2.args.forEach(function (expected, i) {
                var arg = node.args[i].accept(_this);
                if (target_2.isGenerics() && target_2.genericTypes.some(function (n) { return expected.type.includes(n.value); })) {
                    var genericsName = expected.type.name;
                    if (!genericsTable_2.hasOwnProperty(genericsName)) {
                        genericsTable_2[genericsName] = arg;
                    }
                    _this.checkSatisfied(genericsTable_2[genericsName], arg, node.args[i].location);
                }
                else {
                    _this.checkSatisfied(expected.type, arg, node.args[i].location);
                }
            });
            if (target_2.isGenerics()) {
                this.defineFunction(target_2, genericsTable_2);
            }
            return target_2.outputType;
        }
    };
    TypeChecker.prototype.visitReferenceVariable = function (node) {
        var name = node.name.value;
        var type = this.variableEnv.reference(name);
        if (type === null) {
            throw new exception_1.UndefinedError(name, node.location);
        }
        if (node.index !== null) {
            this.checkSatisfied(new type_1.Type('Array', []), type, node.location, true);
            node.index.accept(this);
            return type.innerTypes[0];
        }
        else {
            return type;
        }
    };
    TypeChecker.prototype.visitIfExpression = function (node) {
        var condType = node.condition.accept(this);
        this.checkSatisfied(new type_1.Type('Boolean', []), condType, node.condition.location);
        var thenType = node.thenBlock.accept(this);
        if (node.elseBlock !== null) {
            var elseType = node.elseBlock.accept(this);
            this.checkEquals(thenType, elseType, node.thenBlock.location);
        }
        else {
            if (!thenType.equals(new type_1.Type('Tuple', []))) {
                throw new exception_1.SyntaxError('else block must be needed when then block doesn\'t return unit.', node.location);
            }
        }
        return thenType;
    };
    TypeChecker.prototype.visitIntegerLiteral = function (node) {
        return new type_1.Type('Integer', []);
    };
    TypeChecker.prototype.visitFloatLiteral = function (node) {
        return new type_1.Type('Float', []);
    };
    TypeChecker.prototype.visitBooleanLiteral = function (node) {
        return new type_1.Type('Boolean', []);
    };
    TypeChecker.prototype.visitCharLiteral = function (node) {
        return new type_1.Type('Char', []);
    };
    TypeChecker.prototype.visitArrayLiteral = function (node) {
        var _this = this;
        node.values.forEach(function (value) {
            _this.checkSatisfied(node.type.innerTypes[0], value.accept(_this), value.location);
        });
        return node.type;
    };
    TypeChecker.prototype.visitBlock = function (node) {
        var _this = this;
        this.variableEnv.push();
        var types = node.statemetns.map(function (stmt) { return stmt.accept(_this); });
        this.variableEnv.pop();
        return types[types.length - 1];
    };
    TypeChecker.prototype.visitIdentifier = function (node) {
        throw new Error("Method not implemented.");
    };
    TypeChecker.prototype.defineFunction = function (node, genericsTable) {
        var _this = this;
        this.variableEnv.push();
        node.args.forEach(function (arg) {
            var argType = genericsTable !== null ? genericsTable[arg.type.name] : arg.type;
            _this.variableEnv.define(arg.name.value, argType);
        });
        var prevName = this.currentFunctionName;
        this.currentFunctionName = node.name.value;
        // TODO: returnするパスがあるかどうかチェック
        node.body.accept(this);
        this.currentFunctionName = prevName;
        this.variableEnv.pop();
    };
    TypeChecker.prototype.checkSatisfied = function (expected, actual, location, shallow) {
        if (shallow === void 0) { shallow = false; }
        var equal = shallow ? expected.name === actual.name : expected.equals(actual);
        if (!equal) {
            throw exception_1.TypeError.fromTypes(expected, actual, location);
        }
    };
    TypeChecker.prototype.checkEquals = function (x, y, location) {
        if (!x.equals(y)) {
            throw new exception_1.TypeError("type mismatch (" + x.name + " and " + y.name + ")", location);
        }
    };
    return TypeChecker;
}());
exports.TypeChecker = TypeChecker;

},{"./ast":1,"./environment":3,"./exception":4,"./type":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type = (function () {
    function Type(name, innerTypes) {
        this.name = name;
        this.innerTypes = innerTypes;
    }
    Type.fromFunction = function (resultType, argTypes) {
        return new Type('Function', argTypes.concat([resultType]));
    };
    Type.prototype.toString = function () {
        if (this.innerTypes.length === 0) {
            return this.name;
        }
        else {
            return this.name + "<" + this.innerTypes.join(', ') + ">";
        }
    };
    Type.prototype.equals = function (that) {
        return this.name === that.name &&
            this.innerTypes.length === that.innerTypes.length &&
            this.innerTypes.every(function (type, i) { return type.equals(that.innerTypes[i]); });
    };
    Type.prototype.includes = function (name) {
        if (this.name === name) {
            return true;
        }
        else {
            return this.innerTypes.some(function (type) { return type.includes(name); });
        }
    };
    return Type;
}());
exports.Type = Type;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ChinoObject = (function () {
    function ChinoObject() {
    }
    return ChinoObject;
}());
exports.ChinoObject = ChinoObject;
var ChinoArray = (function (_super) {
    __extends(ChinoArray, _super);
    function ChinoArray(values, length) {
        var _this = _super.call(this) || this;
        _this.values = values;
        _this.length = length;
        return _this;
    }
    return ChinoArray;
}(ChinoObject));
exports.ChinoArray = ChinoArray;
var Generator = (function (_super) {
    __extends(Generator, _super);
    function Generator(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.pc = 0;
        _this.variableEnv = {};
        return _this;
    }
    return Generator;
}(ChinoObject));
exports.Generator = Generator;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var op = require("./operation");
var Value = require("./value");
var compiler_1 = require("./compiler");
var stack_1 = require("./stack");
var environment_1 = require("./environment");
var type_1 = require("./type");
var VirtualMachine = (function () {
    function VirtualMachine() {
        var _this = this;
        this.stack = new stack_1.Stack();
        this.variableEnv = new environment_1.Environment();
        this.globalVariableEnv = [];
        this.externalFunctions = {};
        // for JumpXXX
        this.labelTable = {};
        this.pcStack = new stack_1.Stack();
        this.genStack = new stack_1.Stack();
        this.table = [
            'CallFunction', function (operation) {
                if (operation.name === 'buildArray') {
                    var len = operation.argumentsLength;
                    var values = [];
                    for (var i = 0; i < len; i++) {
                        values.push(_this.stack.pop());
                    }
                    _this.stack.push(new Value.ChinoArray(values.reverse(), len));
                }
                else if (operation.name === 'next') {
                    var gen = _this.stack.pop();
                    if (!(gen instanceof Value.Generator)) {
                        throw new Error('value must be generator');
                    }
                    _this.variableEnv.push(gen.variableEnv);
                    _this.pcStack.push([gen.pc - 1, gen.name]);
                    _this.genStack.push(gen);
                }
                else if (_this.externalFunctions.hasOwnProperty(operation.name)) {
                    var callee = _this.externalFunctions[operation.name];
                    var argLen = callee.argTypes.length;
                    var args = [];
                    for (var i = 0; i < argLen; i++) {
                        args.push(_this.stack.pop());
                    }
                    var result = callee.body.apply(null, args.reverse());
                    if (!callee.outputType.equals(new type_1.Type('Tuple', []))) {
                        _this.stack.push(result);
                    }
                }
                else {
                    if (!_this.functions.hasOwnProperty(operation.name)) {
                        throw new Error("unknown function " + operation.name);
                    }
                    _this.variableEnv.push();
                    // 命令実行後にpcがインクリメントされてしまうので-1
                    _this.pcStack.push([-1, operation.name]);
                }
            },
            'InitGenerator', function (operation) {
                _this.stack.push(new Value.Generator(operation.name));
            },
            'Push', function (operation) {
                _this.stack.push(operation.value);
            },
            'Store', function (operation) {
                var value = _this.stack.pop();
                if (operation.global) {
                    _this.globalVariableEnv[operation.id] = value;
                }
                else {
                    _this.variableEnv.store(operation.id.toString(), value);
                }
            },
            'StoreWithIndex', function (operation) {
                var index = _this.stack.pop();
                var value = _this.stack.pop();
                var target = operation.global ?
                    _this.globalVariableEnv[operation.id] :
                    _this.variableEnv.reference(operation.id.toString());
                if (!_this.isNumber(index)) {
                    throw new Error('right or left must be number');
                }
                if (!(target instanceof Value.ChinoArray)) {
                    throw new Error('value must be array');
                }
                // ここでなぜかtargetがPrimitiveになる(バグ?)
                var t = target;
                t.values[index] = value;
            },
            'Load', function (operation) {
                var value = operation.global ?
                    _this.globalVariableEnv[operation.id] :
                    _this.variableEnv.reference(operation.id.toString());
                if (value !== null) {
                    _this.stack.push(value);
                }
            },
            'LoadWithIndex', function (operation) {
                var index = _this.stack.pop();
                var target = operation.global ?
                    _this.globalVariableEnv[operation.id] :
                    _this.variableEnv.reference(operation.id.toString());
                if (!_this.isNumber(index)) {
                    throw new Error('right or left must be number');
                }
                if (!(target instanceof Value.ChinoArray)) {
                    throw new Error('value must be array');
                }
                // ここでなぜかtargetがPrimitiveになる(バグ?)
                var t = target;
                _this.stack.push(t.values[index]);
            },
            'IArith', function (operation) {
                var right = _this.stack.pop();
                var left = _this.stack.pop();
                if (!_this.isNumber(right) || !_this.isNumber(left)) {
                    throw new Error('right or left must be number');
                }
                var result;
                switch (operation.operation) {
                    case '+':
                        result = left + right;
                        break;
                    case '-':
                        result = left - right;
                        break;
                    case '*':
                        result = left * right;
                        break;
                    case '/':
                        result = left / right;
                        break;
                    case '%':
                        result = left % right;
                        break;
                    default: throw new Error("unknown operation " + operation.operation);
                }
                _this.stack.push(Math.floor(result));
            },
            'FArith', function (operation) {
                var right = _this.stack.pop();
                var left = _this.stack.pop();
                if (!_this.isNumber(right) || !_this.isNumber(left)) {
                    throw new Error('right or left must be number');
                }
                var result;
                switch (operation.operation) {
                    case '+':
                        result = left + right;
                        break;
                    case '-':
                        result = left - right;
                        break;
                    case '*':
                        result = left * right;
                        break;
                    case '/':
                        result = left / right;
                        break;
                    case '%':
                        result = left % right;
                        break;
                    default: throw new Error("unknown operation " + operation.operation);
                }
                _this.stack.push(result);
            },
            'ICmp', function (operation) {
                var right = _this.stack.pop();
                var left = _this.stack.pop();
                var result;
                switch (operation.operation) {
                    case '<=':
                        result = left <= right;
                        break;
                    case '>=':
                        result = left >= right;
                        break;
                    case '<':
                        result = left < right;
                        break;
                    case '>':
                        result = left > right;
                        break;
                    case '==':
                        result = left == right;
                        break;
                    case '!=':
                        result = left != right;
                        break;
                    default: throw new Error("unknown operation " + operation.operation);
                }
                _this.stack.push(result);
            },
            'Jump', function (operation) {
                _this.pcStack.top()[0] = _this.labelTable[operation.destination];
            },
            'JumpIf', function (operation) {
                var cond = _this.stack.pop();
                // TODO: condの型を決定させる
                if (cond === true) {
                    _this.pcStack.top()[0] = _this.labelTable[operation.destination];
                }
            },
            'JumpUnless', function (operation) {
                var cond = _this.stack.pop();
                // TODO: condの型を決定させる
                if (cond !== true) {
                    _this.pcStack.top()[0] = _this.labelTable[operation.destination];
                }
            },
            'Ret', function (operation) {
                _this.variableEnv.pop();
                _this.pcStack.pop();
            },
            'YieldRet', function (operation) {
                _this.variableEnv.pop();
                var pc = _this.pcStack.pop();
                var gen = _this.genStack.pop();
                gen.pc = pc[0] + 1;
            },
            'Label', function (operation) { },
        ];
    }
    VirtualMachine.prototype.run = function (_functions, externalFunctions) {
        var _this = this;
        this.functions = _functions;
        externalFunctions.forEach(function (ext) {
            _this.externalFunctions[ext.name] = ext;
        });
        this.labelTable = {};
        Object.keys(this.functions).forEach(function (funName) {
            _this.functions[funName].forEach(function (operation, i) {
                if (operation instanceof op.Label) {
                    _this.labelTable[operation.id] = i;
                }
                operation.opId = _this.table.findIndex(function (val) { return operation.constructor.name === val; }) + 1;
                if (operation.opId === 0) {
                    throw new Error("unknown operation " + operation.constructor.name);
                }
            });
        });
        this.pcStack.push([0, compiler_1.DefaultFunName]);
        while (true) {
            var pc = this.pcStack.top();
            if (pc[0] >= this.functions[pc[1]].length) {
                break;
            }
            var operation = this.functions[pc[1]][pc[0]];
            var f = this.table[operation.opId];
            if (f === undefined) {
                throw new Error("unknown operation " + operation.constructor.name);
            }
            else {
                // console.log(`${pc[0]}@${pc[1]} ${operation.constructor.name}`, this.stack)
                f(operation);
            }
            pc = this.pcStack.top();
            pc[0]++;
        }
        return this.stack.top();
    };
    VirtualMachine.prototype.isNumber = function (value) {
        return typeof value === 'number';
    };
    return VirtualMachine;
}());
exports.VirtualMachine = VirtualMachine;

},{"./compiler":2,"./environment":3,"./operation":7,"./stack":9,"./type":11,"./value":12}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],16:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],17:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":16,"_process":14,"inherits":15}]},{},[5]);
