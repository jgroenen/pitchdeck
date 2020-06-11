https://guykawasaki.com/the-only-10-slides-you-need-in-your-pitch/

## Run a development environment

```
docker build -t pitchdeck_dev_local:0.0.1 .
docker run -v $(pwd):/var/www/html -p 8080:80 pitchdeck_dev_local:0.0.1
```

You can then access the site at http://localhost:8080 and make changes in your local php files.
