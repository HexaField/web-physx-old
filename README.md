# DEPRECATED
in favour of a better approach https://github.com/HexaField/web-physx

# web-physx - WORK IN PROGRESS
Multi-threaded PhysX in the browser and node with fast behavior logic and minimal wrapping.

This library exposes comprehensive helper functions for setting up common configurations of scenes, bodies, raycasts etc, and also expose functions on the classes themselves. 

Due to the nature of webworkers, there is no way to get around requiring asynchronous getters. However, since the common use cases rarely require back and forth using setters and getters on physics objects, it felt appropriate to push such problem to the user to deal with, which provides freedom and a simpler API.

All worker requests follow a FIFO (first-in, first-out) message queue, ensuring operations are always handled in the expected order. This allows for treating setters as synchronous calls, simplifying the code quite a lot, as majority of use cases will not require getters.

For the cases where complex setter/getter combination, potentially on multiple objects, a complex behavior mechanism can be used. This exists as hooks that can be create at compile time and used at run time.

All PhysX objects can be referenced by proxies on the main thread, which are automatically translated in the worker thread to reference their class counterparts (and vice versa). This allows for complex chaining of referencing and setters using the `new Class().doSomething().getAnotherClass().doSomethingElse()`

Pointers are also exposed, such that the proxy reference is not needed, for cases using userData such as obstacles, controllers and collision events.


