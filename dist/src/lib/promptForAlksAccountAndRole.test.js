"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
const getAlksAccounts_1 = require("./getAlksAccounts");
const getFavorites_1 = require("./getFavorites");
const getStdErrPrompt_1 = require("./getStdErrPrompt");
const alksAccount_1 = require("./state/alksAccount");
const alksRole_1 = require("./state/alksRole");
jest.mock('./getAlksAccounts');
jest.mock('./getFavorites');
jest.mock('./getStdErrPrompt');
jest.mock('./state/alksAccount');
jest.mock('./state/alksRole');
describe('promptForAlksAccountAndRole', () => {
    const mockAccounts = [
        { account: '986533904591/ALKSReadOnly - awsbridgecp1', role: 'ReadOnly' },
        {
            account: '640543234732/ALKSReadOnly - awsbridgedzcell2np',
            role: 'ReadOnly',
        },
        { account: '550629699577/ALKSAdmin - awsbridgedzcp1np', role: 'Admin' },
        {
            account: '657046243912/ALKSReadOnly - awsbridgedzcell2np',
            role: 'ReadOnly',
        },
        {
            account: '469759795247/ALKSReadOnlyPlusApproval - awsbridgeops',
            role: 'ReadOnlyPlusApproval',
        },
        {
            account: '261782789091/ALKSReadOnly - awsclntmgmntcp1',
            role: 'ReadOnly',
        },
        { account: '635030964719/ALKSAdmin - awsclntmgmntdzcp1np', role: 'Admin' },
        {
            account: '137386787517/ALKSReadOnly - awscommonorgcp1',
            role: 'ReadOnly',
        },
        {
            account: '055985823062/ALKSReadOnly - awscommonorgdzcp1np',
            role: 'ReadOnly',
        },
        {
            account: '585246496791/ALKSLabAdmin - awscoxautolabs11',
            role: 'LabAdmin',
        },
        { account: '551664769586/ALKSAdmin - awsepdpapps', role: 'Admin' },
        { account: '221508814545/ALKSAdmin - awsepdpappsnp', role: 'Admin' },
        { account: '118078152803/ALKSAdmin - awsepdpops', role: 'Admin' },
        { account: '842430935180/ALKSReadOnly - awssignincell1', role: 'ReadOnly' },
        { account: '224526364523/ALKSReadOnly - awssignincell2', role: 'ReadOnly' },
        { account: '507452165201/ALKSReadOnly - awssignincell3', role: 'ReadOnly' },
    ];
    const mockFavorites = [
        '221508814545/ALKSAdmin - awsepdpappsnp',
        '055985823062/ALKSReadOnly - awscommonorgdzcp1np',
        '635030964719/ALKSAdmin - awsclntmgmntdzcp1np',
        '657046243912/ALKSReadOnly - awsbridgedzcell2np',
        '640543234732/ALKSReadOnly - awsbridgedzcell2np',
        '550629699577/ALKSAdmin - awsbridgedzcp1np',
    ];
    let mockPromptFn;
    beforeEach(() => {
        jest.resetAllMocks();
        getAlksAccounts_1.getAlksAccounts.mockResolvedValue(mockAccounts);
        getFavorites_1.getFavorites.mockResolvedValue(mockFavorites);
        mockPromptFn = jest.fn().mockResolvedValue({
            alksAccount: 'awscoxautolabs11 ..... 585246496791/ALKSLabAdmin :: LabAdmin',
        });
        getStdErrPrompt_1.getStdErrPrompt.mockReturnValue(mockPromptFn);
    });
    it('prompts the user with formatted role output', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(mockPromptFn.mock.calls[0][0][0].choices).toStrictEqual([
            // favorites pulled to top after alphabetical sort
            'awsbridgedzcell2np .. 640543234732/ALKSReadOnly              ::  ReadOnly',
            'awsbridgedzcell2np .. 657046243912/ALKSReadOnly              ::  ReadOnly',
            'awsbridgedzcp1np .... 550629699577/ALKSAdmin                 ::  Admin',
            'awsclntmgmntdzcp1np . 635030964719/ALKSAdmin                 ::  Admin',
            'awscommonorgdzcp1np . 055985823062/ALKSReadOnly              ::  ReadOnly',
            'awsepdpappsnp ....... 221508814545/ALKSAdmin                 ::  Admin',
            'awsbridgecp1 ........ 986533904591/ALKSReadOnly              ::  ReadOnly',
            'awsbridgeops ........ 469759795247/ALKSReadOnlyPlusApproval  ::  ReadOnlyPlusApproval',
            'awsclntmgmntcp1 ..... 261782789091/ALKSReadOnly              ::  ReadOnly',
            'awscommonorgcp1 ..... 137386787517/ALKSReadOnly              ::  ReadOnly',
            'awscoxautolabs11 .... 585246496791/ALKSLabAdmin              ::  LabAdmin',
            'awsepdpapps ......... 551664769586/ALKSAdmin                 ::  Admin',
            'awsepdpops .......... 118078152803/ALKSAdmin                 ::  Admin',
            'awssignincell1 ...... 842430935180/ALKSReadOnly              ::  ReadOnly',
            'awssignincell2 ...... 224526364523/ALKSReadOnly              ::  ReadOnly',
            'awssignincell3 ...... 507452165201/ALKSReadOnly              ::  ReadOnly',
        ]);
    }));
    it('returns the ALKS account and role', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(result).toStrictEqual({
            alksAccount: '585246496791/ALKSLabAdmin - awscoxautolabs11',
            alksRole: 'LabAdmin',
        });
    }));
    it('should filter non-favorites if filterFavorites is true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({ filterFavorites: true });
        expect(mockPromptFn.mock.calls[0][0][0].choices.length).toBe(6);
    }));
    it('should throw an error if no accounts are found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAlksAccounts_1.getAlksAccounts.mockResolvedValue([]);
        yield expect((0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({})).rejects.toThrow('No accounts found.');
    }));
    it('should use default account and role if available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        alksAccount_1.getAlksAccount.mockResolvedValue('585246496791/ALKSLabAdmin - awscoxautolabs11');
        alksRole_1.getAlksRole.mockResolvedValue('LabAdmin');
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(mockPromptFn.mock.calls[0][0][0].default).toBe('awscoxautolabs11 .... 585246496791/ALKSLabAdmin              ::  LabAdmin');
    }));
});
//# sourceMappingURL=promptForAlksAccountAndRole.test.js.map