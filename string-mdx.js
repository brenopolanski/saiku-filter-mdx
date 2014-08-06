// NOT USE ;)

var swap_var = 'rows';
var log = {Logical_Expression: '(([Variavel].[Taxa de analfabetismo da população de 11 a 14 anos de idade]) > 150)'};

var str = ('SELECT\n' +
		  'NON EMPTY {Hierarchize({[Municipio].[Municipio].Members})} ON COLUMNS,\n' +
          'NON EMPTY {Hierarchize({[Variavel].[Taxa de analfabetismo da população de 11 a 14 anos de idade]})} ON ROWS\n' +
          'FROM [Conceito_Breno]').split('\n');

//  var str = 'SELECT\n' +
		   // 'NON EMPTY CrossJoin({[Variavel].[Taxa de analfabetismo da população de 11 a 14 anos de idade]}, [Estado].[UF].Members) ON COLUMNS,\n' +
//             'NON EMPTY Hierarchize(Union(CrossJoin({[Municipio].[2504009].[Campina Grande]}, CrossJoin([Ano].[Ano].Members, [Medida].[Sigla].Members)), CrossJoin({[Municipio].[2504009].[Campina Grande]}, CrossJoin([Ano].[Ano].Members, [Medida].[Unidade].Members)))) ON ROWS\n' +
//             'FROM [Conceito_Breno]';

// str = str.split('\n');

// str = str[1].split('NON EMPTY ');
// str = str[1].split(' ON COLUMNS,');
// str = str[0]

// str = str[2].split('NON EMPTY ');
// str = str[1].split(' ON ROWS');
// str = str[0]

// console.log(str[1]);
// console.log(templateExpFilter(splitMDX(str), log));
// console.log(splitMDX(str));

function splitMDX(str) {
    str = str[1].split('NON EMPTY ');
    str = str[1].split(' ON COLUMNS,');
    str = str[0]

    return str;
}

function templateExpFilter(str, log) {
	var t = 'NON EMPTY FILTER(' + str + ', {Logical_Expression}) ' + 'ON COLUMNS,';

	return t.replace(/{(\w+)}/g, function(m, p) {
		return log[p];
	});
}

function expressionMDX(str, tpl) {
	str[1] = tpl;
	str = str[0] + str[1] + str[2] + str[3];
	console.log(str);
}

var tpl = templateExpFilter(splitMDX(str), log);

console.log(tpl);

expressionMDX(str, tpl);
