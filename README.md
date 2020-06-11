https://guykawasaki.com/the-only-10-slides-you-need-in-your-pitch/

Code for NL styled version

![](./screenshot.png =400x)

## Run a development environment

```
docker build -t pitchdeck_dev_local:0.0.1 .
docker run -p 8080:80 pitchdeck_dev_local:0.0.1
```

You can then access the site at http://localhost:8080 and make changes in your local php files.

```
docker run -it -v "$PWD":/var/www/html -p 8080:80 pitchdeck_dev_local:0.0.1
```

To mount from the current directory
