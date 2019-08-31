const babel = require('babel-core');//babel核心解析库
const t = require('babel-types');//babel类型转化库
let code = `import React, { Component } from 'react';
import * as monaco from 'monaco-editor';
import { Icon, Tabs } from 'antd';
import io from 'socket.io-client';
import MonacoEditor from '../../lib/MonacoEditor';
import EventNotify from '../../lib/EventNotify';
import Network from '../../lib/Network';`;
let importPlugin = {
    visitor: {
        ImportDeclaration(path){
            let {node} = path;
            //console.log(node);
            let source = node.source.value;
            let specifiers =  node.specifiers;
            if(!t.isImportDefaultSpecifier(specifiers[0])){
                specifiers = specifiers.map(specifier=>{
                    return t.importDeclaration(
                        [t.importDefaultSpecifier(specifier.local)],
                        t.stringLiteral(`${source}/lib/${specifier.local.name.toLowerCase()}`)
                    )
                });
                path.replaceWithMultiple(specifiers);
            }
        }
    }
}
let r = babel.transform(code, {
    plugins: [
        importPlugin
    ]
});
console.log(r.metadata.modules.imports);