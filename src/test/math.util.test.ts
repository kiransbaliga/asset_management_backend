import { when } from "jest-when";
import MathUtil from "../utils/math.util";

describe('Test average function',()=>{
    describe('Test average success cases',()=>{
        test('Test average success case',()=>{
            MathUtil.sum = jest.fn().mockReturnValueOnce(8);
            expect(MathUtil.average(4,4)).toBe(4);
        })

        test('Test average 4+4',()=>{
            const mockedFunction = jest.fn();
            MathUtil.sum = mockedFunction;
            when(mockedFunction).calledWith(5,3).mockReturnValueOnce(8)
            expect(MathUtil.average(5,3)).toBe(4);
        })


        
    })
    
    test('Test average failure case',()=>{
        expect(MathUtil.average(4,4)).not.toBe(3);
    })

    // test('Test sum success case',()=>{
    //     expect(MathUtil.sum(4,4)).toBe(8);
    // })
})
