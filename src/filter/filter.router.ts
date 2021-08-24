import { Router, Request, Response, NextFunction } from 'express';

import { filterImageFromURL, deleteLocalFiles } from '../util/util';

const router: Router = Router();

// Register cleanUp function to be fired on 'finish' event
router.use(function (req: Request, res: Response, next: NextFunction) {
  async function cleanUpAfterResponce() {
    // CleanUp the event listener after execution
    res.removeListener('finish', cleanUpAfterResponce);

    // CleanUp
    deleteLocalFiles();
  }
  // Hook up the event emmiter on the Cleanup function
  res.on('finish', cleanUpAfterResponce);

  next();
});

// Router handler for /filteredimage
router.get('/', async (req, res) => {
  let { image_url } = req.query;

  if (!image_url) {
    return res.status(400).send('Please provide image URL');
  }

  image_url = image_url.toString();

  let filteredImagePath;
  try {
    filteredImagePath = await filterImageFromURL(image_url);
  } catch (e) {
    return res.status(422).send(`Image has some problem: ${e.message}`);
  }

  if (filteredImagePath) res.sendFile(filteredImagePath);
});

export const imageFilter: Router = router;
