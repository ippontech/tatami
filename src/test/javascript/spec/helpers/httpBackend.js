function mockApiAccountCall() {
    inject(function($httpBackend) {
        $httpBackend.whenGET(/tatami\/account.*/).respond({});
    });
}

function mockI18nCalls() {
    inject(function($httpBackend) {
        $httpBackend.whenGET(/i18n\/.*\/.+\.json/).respond({});
    });
}

function mockScriptsCalls() {
    inject(function($httpBackend) {
        $httpBackend.whenGET(/scripts\/.*/).respond({});
    });
}
