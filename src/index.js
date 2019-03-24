module.exports = function solveSudoku(matrix) {
    // первое приближение - однозначные варианты
    for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][j] = getVariants(matrix, i,j);
            }
        }
    }

    //второе приближение - на всякий случай прогоним несколько раз ;)
    for (let q=1;q<9; q++) {
        // уточняем по строкам возможные варианты
        for (let r = 0; r < 9; r++) {
            let so = {};
            let solved = new Set();
            let must_solve = [];
            // в строке ищем нерешённые ячейки
            for (let i = 0; i < 9; i++) {
                if (matrix[r][i] instanceof Set) {
                    must_solve.push([r,i]); // запоминаем нерешённый столбец в текущей строке
                    // считаем повторяемость возможных вариантов
                    matrix[r][i].forEach(e => so[e] ? so[e].q++ : so[e] = {q: 1, r:r, c:i});
                } else {
                    solved.add(matrix[r][i]);
                }
            }
           exclude(matrix, must_solve, solved, so);
        }

        // уточняем по столбцам возможные варианты
        for (let c = 0; c < 9; c++) {
            let so = {};
            let solved = new Set();
            let must_solve = [];
            // в строке ищем нерешённые ячейки
            for (let i = 0; i < 9; i++) {
                if (matrix[i][c] instanceof Set) {
                    // считаем повторяемость возможных вариантов
                    must_solve.push([i,c]); // запомиаем нерешённую строку в текущем столбце
                    matrix[i][c].forEach(e => so[e] ? so[e].q++ : so[e] = {q: 1, r:i,c:c});
                } else {
                    solved.add(matrix[i][c]);
                }
            }
            exclude(matrix, must_solve, solved, so);
        }

        // уточняем по квадратам возможные варианты
        [0, 3, 6].forEach(r => {
            [0, 3, 6].forEach(c => {
                //_log('------', r,c);
                let solved = new Set();
                let so = {};
                let must_solve = [];
                for (let i = r; i < r + 3; i++) {
                    for (let j = c; j < c + 3; j++) {
                        if (matrix[i][j] instanceof Set) {
                            must_solve.push([i,j]); // запоминаем нерешённую ячейку в текущес квадрате
                            matrix[i][j].forEach(e => so[e] ? so[e].q++ : so[e] = {q: 1, r: i, c: j})
                        } else {
                            solved.add(matrix[i][j]*1);
                        }
                    }
                }
                exclude(matrix, must_solve, solved, so);
            })
        });
    }


    //print(matrix);
    return matrix;
};

/*----------------------------------------------------------------*/
function exclude(matrix, must_solve, solved, so) {
    for (let m of must_solve) {
        let r = m[0];
        let c = m[1];
        matrix[r][c].forEach(e => {
            if (solved.has(e)) {
                matrix[r][c].delete(e);
            }
        });
        if (matrix[r][c].size == 1) {
            matrix[r][c] = [...matrix[r][c]][0];
            solved.add(matrix[r][c] * 1);
        } else {
            matrix[r][c].forEach(e => {
                if (so[e+''].q == 1) {
                    matrix[r][c] = e;
                    solved.add(e*1);
                }
            })
        }
    }
}
/*----------------------------------------------------------------*/

function getVariants(matrix, r, c) {
    let varr = new Set([1,2,3,4,5,6,7,8,9]);
    // проверяем по строке
    matrix[r].map(e => { if (!Array.isArray(e)) varr.delete(e); });
    // проверяем по столбцу
    for (let i=0; i<9; i++) {
        if (!Array.isArray(matrix[i][c])) varr.delete(matrix[i][c])
    }
    // проверяем по квадрату
    let [rr,cc] = [Math.floor(r/3)*3, Math.floor(c/3)*3];
    a = [];
    let x = -1;
    for (let i=rr; i<rr+3; i++) {
        a[++x] = [];
        for (let j = cc; j < cc+3; j++) {
            varr.delete(matrix[i][j]);
        }
    }
    // возвращаем в виде множества список вариантов или готовое решение для текущей ячейки
    return varr.size > 1 ? varr : [...varr][0];
}

/*----------------------------------------------------------------*/
function print(matrix) {
    // красивый вывод матрицы
    console.log('       (0)               (1)               (2)               (3)               (4)               (5)               (6)               (7)               (8)');
    for (let r in matrix) {
        s = matrix[r].reduce((s, e) => (s += e instanceof Set ? ('{'+[...e].join('')+'}').padEnd(15,' ') : (e+'').padEnd(15,' '))+ '| ', '');
        console.log(r+')', '[ '+s+' ]');
    }
}
