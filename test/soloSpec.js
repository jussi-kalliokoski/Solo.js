"use strict";

describe("Solo", function () {
    var queue;

    beforeEach(function () {
        queue = Solo();
    });

    it("should execute a synchronous task", function () {
        var spy = sinon.mock().returns("foo");
        return queue(spy).then(function (result) {
            expect(spy.callCount).to.equal(1);
            expect(result).to.equal("foo");
        });
    });

    it("should execute an asyncronous task", function () {
        var spy = sinon.spy();
        return queue(function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    spy();
                    resolve("bar");
                }, 1);
            });
        }).then(function (result) {
            expect(spy.callCount).to.equal(1);
            expect(result).to.equal("bar");
        });
    });

    it("should reject if a synchronous task fails", function () {
        var spy = sinon.spy();

        return queue(function () {
            spy();
            throw new Error("fail");
        }).then(function () {
            throw new Error("w00t");
        }).catch(function (error) {
            expect(spy.callCount).to.equal(1);
            expect(error.message).to.equal("fail");
        });
    });

    it("should reject if an asynchronous task fails", function () {
        var spy = sinon.spy();

        return queue(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    spy();
                    reject(new Error("fail"));
                }, 1);
            });
        }).then(function () {
            throw new Error("w00t");
        }).catch(function (error) {
            expect(spy.callCount).to.equal(1);
            expect(error.message).to.equal("fail");
        });
    });

    it("should not block queue on a failed synchronous task", function () {
        var spy = sinon.spy();
        var failSpy = sinon.spy();

        queue(function () {
            failSpy();
            throw new Error("fail");
        });

        return queue(spy).then(function () {
            expect(spy.callCount).to.equal(1);
            expect(failSpy.callCount).to.equal(1);
        });
    });

    it("should not block queue on a failed asynchronous task", function () {
        var spy = sinon.spy();
        var failSpy = sinon.spy();

        queue(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    failSpy();
                    reject(new Error("fail"));
                }, 1);
            });
        });

        return queue(spy).then(function () {
            expect(spy.callCount).to.equal(1);
            expect(failSpy.callCount).to.equal(1);
        });
    });

    it("should execute tasks in sequence", function () {
        var spies = [sinon.spy(), sinon.spy(), sinon.spy()];
        var done;
        var order = [];
        spies.forEach(function (spy, index) {
            done = queue(function () {
                order.push(index);
                spy();
            });
        });

        done.then(function () {
            spies.forEach(function (spy) {
                expect(spy.callCount).to.equal(1);
            });

            expect(order).to.eql([0, 1, 2]);
        });
    });
});
