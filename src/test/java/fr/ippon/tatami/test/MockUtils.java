package fr.ippon.tatami.test;

import org.mockito.internal.util.MockUtil;

import java.util.concurrent.Callable;

public class MockUtils {

    /**
     * @param mock a Mockito mock
     * @return
     */
    public static int getNumberOfInvocation(Object mock) {
        // WARNING : we use internal mockito code here :
        return new MockUtil().getMockHandler(mock).getInvocationContainer().getInvocations().size();
    }

    /**
     * To be used with Awaitility.await().until(xxx)
     *
     * @param mock
     * @param minInvocationCount
     * @return
     */
    public static Callable<Boolean> mockCalledCallable(final Object mock, final int minInvocationCount) {
        return new Callable<Boolean>() {
            public Boolean call() throws Exception {
                int nbCalls = getNumberOfInvocation(mock);
                return nbCalls >= minInvocationCount;
            }
        };
    }

}
