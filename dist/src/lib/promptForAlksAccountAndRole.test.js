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
        { account: '123456789012/ALKSReadOnly - devaccount1', role: 'ReadOnly' },
        {
            account: '111111111111/ALKSReadOnly - testenv2',
            role: 'ReadOnly',
        },
        { account: '987654321098/ALKSAdmin - prodbridge1', role: 'Admin' },
        {
            account: '456789012345/ALKSReadOnly - stagingcell2',
            role: 'ReadOnly',
        },
        {
            account: '789012345678/ALKSReadOnlyPlusApproval - operations',
            role: 'ReadOnlyPlusApproval',
        },
        {
            account: '345678901234/ALKSReadOnly - clientmgmt1',
            role: 'ReadOnly',
        },
        { account: '678901234567/ALKSAdmin - clientstaging', role: 'Admin' },
        {
            account: '234567890123/ALKSReadOnly - sharedservices',
            role: 'ReadOnly',
        },
        {
            account: '567890123456/ALKSReadOnly - commontools',
            role: 'ReadOnly',
        },
        {
            account: '890123456789/ALKSLabAdmin - devlabs',
            role: 'LabAdmin',
        },
        { account: '012345678901/ALKSAdmin - prodapps', role: 'Admin' },
        { account: '543210987654/ALKSAdmin - testapps', role: 'Admin' },
        { account: '321098765432/ALKSAdmin - opstools', role: 'Admin' },
        { account: '654321098765/ALKSReadOnly - identity1', role: 'ReadOnly' },
        { account: '876543210987/ALKSReadOnly - identity2', role: 'ReadOnly' },
        { account: '109876543210/ALKSReadOnly - identity3', role: 'ReadOnly' },
    ];
    const mockFavorites = [
        '543210987654/ALKSAdmin - testapps',
        '567890123456/ALKSReadOnly - commontools',
        '678901234567/ALKSAdmin - clientstaging',
        '456789012345/ALKSReadOnly - stagingcell2',
        '111111111111/ALKSReadOnly - testenv2',
        '987654321098/ALKSAdmin - prodbridge1',
        '890123456789/ALKSLabAdmin - devlabs',
    ];
    let mockPromptFn;
    beforeEach(() => {
        jest.resetAllMocks();
        getAlksAccounts_1.getAlksAccounts.mockResolvedValue(mockAccounts);
        getFavorites_1.getFavorites.mockResolvedValue(mockFavorites);
        mockPromptFn = jest.fn().mockResolvedValue({
            alksAccount: 'devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin',
        });
        getStdErrPrompt_1.getStdErrPrompt.mockReturnValue(mockPromptFn);
    });
    it('prompts the user with formatted role output', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(mockPromptFn.mock.calls[0][0][0].choices).toStrictEqual([
            // favorites pulled to top after alphabetical sort
            'clientstaging .. 678901234567/ALKSAdmin                 ::  Admin',
            'commontools .... 567890123456/ALKSReadOnly              ::  ReadOnly',
            'devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin',
            'prodbridge1 .... 987654321098/ALKSAdmin                 ::  Admin',
            'stagingcell2 ... 456789012345/ALKSReadOnly              ::  ReadOnly',
            'testapps ....... 543210987654/ALKSAdmin                 ::  Admin',
            'testenv2 ....... 111111111111/ALKSReadOnly              ::  ReadOnly',
            'clientmgmt1 .... 345678901234/ALKSReadOnly              ::  ReadOnly',
            'devaccount1 .... 123456789012/ALKSReadOnly              ::  ReadOnly',
            'identity1 ...... 654321098765/ALKSReadOnly              ::  ReadOnly',
            'identity2 ...... 876543210987/ALKSReadOnly              ::  ReadOnly',
            'identity3 ...... 109876543210/ALKSReadOnly              ::  ReadOnly',
            'operations ..... 789012345678/ALKSReadOnlyPlusApproval  ::  ReadOnlyPlusApproval',
            'opstools ....... 321098765432/ALKSAdmin                 ::  Admin',
            'prodapps ....... 012345678901/ALKSAdmin                 ::  Admin',
            'sharedservices . 234567890123/ALKSReadOnly              ::  ReadOnly',
        ]);
    }));
    it('returns the ALKS account and role', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(result).toStrictEqual({
            alksAccount: '890123456789/ALKSLabAdmin - devlabs',
            alksRole: 'LabAdmin',
        });
    }));
    it('should filter non-favorites if filterFavorites is true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({ filterFavorites: true });
        expect(mockPromptFn.mock.calls[0][0][0].choices.length).toBe(mockFavorites.length);
    }));
    it('should throw an error if no accounts are found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAlksAccounts_1.getAlksAccounts.mockResolvedValue([]);
        yield expect((0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({})).rejects.toThrow('No accounts found.');
    }));
    it('should use default account and role if available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        alksAccount_1.getAlksAccount.mockResolvedValue('890123456789/ALKSLabAdmin - devlabs');
        alksRole_1.getAlksRole.mockResolvedValue('LabAdmin');
        yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({});
        expect(mockPromptFn.mock.calls[0][0][0].default).toBe('devlabs ........ 890123456789/ALKSLabAdmin              ::  LabAdmin');
    }));
});
//# sourceMappingURL=promptForAlksAccountAndRole.test.js.map