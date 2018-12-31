const Page = require('./helpers/page');

let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog creation form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows error message', async () => {
      const tittleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(tittleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting and save add post to home page', async () => {
      await page.click('button.green');
      await page.waitFor('.card')

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  })
});

describe('When not logged in', async () => {
  test('User cannot create blogpost', async () => {
    const result = await page.post('/api/blogs', { title: 'My Title', content: 'My Content' });
    
    expect(result).toEqual({ error: 'You must log in!' })
  });

  test('user cannot view list of posts', async () => {
    const result = await page.get('/api/blogs');

    expect(result).toEqual({ error: 'You must log in!' })
  });
});