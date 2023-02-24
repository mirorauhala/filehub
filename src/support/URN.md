# URN

Filebase uses the URN format internally to locate files. This makes it easier to
work with relative paths and to work with files in different locations. The URN
format looks like this:

```
frn:fs:trash:<path>
frn:fs:cloud:<path>
```

The first part of the URN is the `filebase` namespace. The second part is the
`path` type. The third part is the `trash` or `cloud` location. Last part is the
path to the file or directory in `base64` format.

The encoded filepath is always relative to the root of the location. For example,
if you have a file called `foo/bar` in the trash location, the URN would look
like this:

```
frn:filebase:path:trash:Zm9vL2Jhcg==
```
