var mongoose =require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = "http://localhost:5000/api/bicicletas";

describe('Bicicleta API', () => {
    beforeAll((done) => {
        mongoose.connection.close().then(() => {
            var mongoDB = 'mongodb://localhost/testdb';
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.set('useCreateIndex', true);

            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {
                console.log('We are connected to test database!');
                done();
            });
        });
    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err)console.log(err);
            done();
        });
    });

    describe('GET Bicicletas /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function (error, response, body) {
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{ "code": 10, "color": "rojo", "modelo": "urbana", "lat": 11.230222, "lng": -74.210949 }';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(11.230222);
                expect(bici.ubicacion[1]).toBe(-74.210949);
                done();
            });
        });
    });  

    describe('UPDATE Bicicletas /update', () => {
        it('Status 200', (done) => {
            var headers = { 'content-type': 'application/json' };
            var bici = '{ "code": 3, "color": "azul", "modelo": "urbana", "lat": 3.4760683, "lng": -76.4887271 }';

            var a = new Bicicleta({
                code: 3,
                color: 'rojo',
                modelo: 'montaña',
                ubicacion: [3.4693968, -76.4887123]
            });

            Bicicleta.add(a, function (err, newBici) {
                request.put({
                    headers: headers,
                    url: `${base_url}/update`,
                    body: bici
                }, function (err, resp, body) {
                    expect(resp.statusCode).toBe(200);

                    Bicicleta.findByCode(a.code, function (err, targetBici) {
                        console.log(targetBici);

                        expect(targetBici.color).toBe('azul');
                        expect(targetBici.modelo).toBe('urbana');
                        expect(targetBici.ubicacion[0]).toBe(3.4760683);
                        expect(targetBici.ubicacion[1]).toBe(-76.4887271);

                        done();
                    });
                });
            });
        });
    });

    describe('DELETE Bicicletas /delete', () => {
        it('Status 204', (done) => {
            var a = Bicicleta.createInstance(4, 'gris', 'urbana', [3.4693968, -76.4887123]);

            Bicicleta.add(a, function (err, newBici) {
                var headers = { 'content-type': 'application/json' };
                var bici = '{ "code": 4 }';

                request.delete({
                    headers: headers,
                    url: `${base_url}/delete`,
                    body: bici
                }, function (err, resp, body) {
                    expect(resp.statusCode).toBe(204);

                    Bicicleta.allBicis(function (err, newBicis) {
                        expect(newBicis.length).toBe(0);

                        done();
                    });
                });
            });
        });
    });
});