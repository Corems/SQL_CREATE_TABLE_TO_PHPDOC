let parserSQL = {
    parse(objectValue) {
        let regex = /`(.+?)`\s(.+?)\s\w{1,}/gim;
        let regex2 = /`(.+?)`\s(.+?)\s/;
        let matches = objectValue.match(regex);

        let fieldsArray = [];

        for (match in matches) {
            let tmp = regex2.exec(matches[match]);
            if (tmp) {
                let fieldObject = {};
                fieldObject.name = tmp[1];
                fieldObject.type = this.replaceTypes(tmp[2]);
                fieldsArray.push(fieldObject);
            }
        }

        return fieldsArray;
    },
    performTranslate(idSource, idDestination) {
        let sourceSql = document.getElementById(idSource).value;
        let fieldsArray = this.parse(sourceSql);
        let phpDoc = this.getPhpDoc(fieldsArray);

        document.getElementById(idDestination).value = phpDoc;
    },
    getPhpDoc(fieldsArray) {
        if (fieldsArray) {
            let result = '/**\n';

            for (item in fieldsArray) {
                result += ' * @property ' +  fieldsArray[item].type + ' $' + fieldsArray[item].name + '\n';
            }

            result += '*/';

            return result;
        }

        return '';
    },
    replaceTypes(type) {
        let replaceArray = [];

        replaceArray.push({
            regex: /int\(1\)/,
            returnType: 'boolean'
        });

        replaceArray.push({
            regex: /varchar\(\d+\)/,
            returnType: 'string'
        });

        replaceArray.push({
            regex: /int\(\d+\)/,
            returnType: 'integer'
        });

        replaceArray.push({
            regex: /text/,
            returnType: 'string'
        });

        for (item in replaceArray) {
            if (type.match(replaceArray[item].regex)) {
                return replaceArray[item].returnType;
            }
        }

        return type;
    }
};