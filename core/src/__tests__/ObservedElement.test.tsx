/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as BroTest from '../../testing/BroTest';
import { getTabsterAttribute, Types } from '../Tabster';

interface WindowWithTabsterInternal extends Window { __tabsterInstance: Types.TabsterInternal; }

describe('Focusable', () => {
    beforeAll(async () => {
        await BroTest.bootstrapTabsterPage();
    });

    it('should request focus for element with tabindex -1', async () => {
        const name = 'test';
        await new BroTest.BroTest(
            (
                <div {...getTabsterAttribute({ root: {} })}>
                    <button>Button1</button>
                    <button
                        {...getTabsterAttribute({ observed: { name } })}
                        tabIndex={-1}
                    >
                        Button2
                    </button>
                </div>
            )
        )
            .pressTab()
            .activeElement(el => {
                expect(el?.textContent).toContain('Button1');
            })
            .eval((name) => {
                // @ts-ignore
                return (window as unknwon as WindowWithTabsterInternal).__tabsterInstance.observedElement.requestFocus(
                    name,
                    0,
                );
            }, name)
            .check((res: boolean) => expect(res).toBe(true))
            .activeElement(el => {
                expect(el?.textContent).toContain('Button2');
            });
    });
});
