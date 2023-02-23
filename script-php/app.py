from flask import Flask, render_template, request, redirect,flash, session
from flask_mysqldb import MySQL

app = Flask(__name__)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'newuser'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'LUAN'
app.secret_key = 'password'

mysql = MySQL(app)

def check_authenticated():
    if 'email' not in session:
        return False
    return True


@app.route("/")
def default():
    return redirect("/login")

# Rota para a página da lista de dados
@app.route('/inicial')
def inicial():
    if not check_authenticated():
        return redirect('/login')
    else:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM tbl_livro")
        data = cur.fetchall()
        columns = [col[0] for col in cur.description]
        cur.close()
        return render_template('index.html', data=data, columns=columns)

@app.route("/colunas", methods=["GET"])
def get_colunas():
    colunas = ["coluna1", "coluna2", "coluna3"] # exemplo de lista de colunas
    return jsonify(colunas)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Recuperar os dados do formulário
        email = request.form['username']
        password = request.form['password']
        

        # Realizar a conexão com o banco de dados
        cur = mysql.connection.cursor()
        

        # Executar a consulta SQL para validar o usuário
        result = cur.execute(f"SELECT * FROM users WHERE username = '{email}' AND password = {password}")
        user = cur.fetchone()
        session['user_id'] = user[0]

        # Verificar se o usuário existe
        if result > 0:
            # Armazenar informações do usuário na sessão
            session['email'] = email

            # Redirecionar para a página inicial
            return redirect("/inicial")
        else:
            # Mostrar mensagem de erro na tela
            flash("Usuário ou senha inválidos", "danger")
            return redirect("/")
            

    return render_template("login.html")




@app.route('/deletar', methods=['POST'])
def deletar():
    id = request.json['id']
    cursor = mysql.connection.cursor()
    cursor.execute(f"DELETE FROM tbl_livro WHERE id_livro = {id}")
    mysql.connection.commit()
    cursor.close()
    # Aqui você precisa adicionar o código para deletar o registro com o id especificado no seu banco de dados
    return ({'status': 'Registro deletado com sucesso'}), 200



@app.route('/incluir', methods=['POST'])
def incluir():
    data = request.get_json()
    campo1 = request.json['campo1']
    campo2 = request.json['campo2']
    campo3 = request.json['campo3']

    # Adiciona os valores na tabela
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO tbl_livro (nome_livro, data_pub, preco_livro) VALUES ('{campo1}','{campo2}',{campo3})")
    mysql.connection.commit()
    cursor.close()
    return "Registro incluído com sucesso", 200


# Rota para a página de edição
@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM tbl_livro WHERE id=%s", (id,))
    data = cur.fetchone()
    cur.close()

    
@app.route('/atualizar', methods=['POST'])
def atualizar_registro():
    id = request.json['id']
    campo1 = request.json['campo1']
    campo2 = request.json['campo2']
    campo3 = request.json['campo3']
    cursor = mysql.connection.cursor()
    cursor.execute(f"UPDATE tbl_livro SET nome_livro = '{campo1}', data_pub = '{campo2}', preco_livro = '{campo3}' WHERE id_livro = {id}")
    mysql.connection.commit()
    cursor.close()
    return ({'mensagem': 'Registro atualizado com sucesso'}), 200


if __name__ == '__main__':
    app.run(debug=True)
