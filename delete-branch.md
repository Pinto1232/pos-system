
# Deleting the Branch `fix-authentication`

## Delete the Remote Branch

To delete the remote branch, use the following command:

```sh
git push origin --delete fix-authentication
```

## Delete the Local Branch

To delete the local branch, use the following command:

```sh
git branch -d fix-authentication
```

If the branch has not been merged, you may need to force delete it using:

```sh
git branch -D fix-authentication
```
