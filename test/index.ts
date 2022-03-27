import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { Client } from '../'

var MyClient= new Client();

test('getItems', async () => {
    const Res= await MyClient.getItems([274974442]);
    assert.is((Res.success && Res.data.length > 0),true);
});
test('getFilesFromItems', async () => {
    const getItems= await MyClient.getItems([274974442]);
    assert.is((getItems.success && getItems.data.length > 0),true);

    const getFiles= await MyClient.getFilesFromItems(getItems.data);
    assert.is((getFiles.success && getFiles.data.length > 0),true);
});

test('getFiles', async () => {
    const Res= await MyClient.getFiles([274974442]);
    assert.is((Res.success && Res.data.length > 0),true);
});

test.run();